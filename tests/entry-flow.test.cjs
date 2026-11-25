const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies = {}, globals = {}) {
  const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, { exports, require: id => {
    if (!(id in dependencies)) throw new Error(`Unexpected import: ${id}`);
    return dependencies[id];
  }, ...globals });
  return exports;
}

const welcomeProps = { props: { landingPageData: { header_title: 'Market' } } };
const entry = load('pages/index.js', { './welcome': {
  default: () => null, getServerSideProps: async () => welcomeProps,
} });
const context = (query = {}, cookies = {}) => ({ query, req: { cookies } });

test('fresh visitors receive onboarding content instead of an empty catalogue', async () => {
  assert.equal(await entry.getServerSideProps(context()), welcomeProps);
});
test('explicit market choice overrides a stale cookie', async () => {
  const result = await entry.getServerSideProps(context({ module: '1' }, { selectedModule: '2' }));
  assert.equal(result.redirect.destination, '/home?module=1');
});
test('Home stays distinct from Shop for returning visitors; legacy links retain their market', async () => {
  assert.equal(await entry.getServerSideProps(context({}, { selectedModule: '2' })), welcomeProps);
  assert.equal((await entry.getServerSideProps(context({ module_id: '2' }))).redirect.destination, '/home?module=2');
});
test('malformed or unrelated module selections do not bypass onboarding', async () => {
  for (const module of ['garbage', '4', '//example.com', {}, 'undefined']) {
    assert.equal(await entry.getServerSideProps(context({ module })), welcomeProps);
  }
});
test('corrupted persisted module state cannot crash navigation', () => {
  const helpers = load('src/helper-functions/getCurrentModuleType.js', {}, {
    window: { localStorage: { getItem: () => '{broken' } },
  });
  assert.equal(helpers.getCurrentModuleType(), undefined);
  assert.equal(helpers.getCurrentModuleId(), undefined);
});
test('primary button colors meet WCAG normal-text contrast', () => {
  const { lightThemeOptions: { palette } } = load('src/theme/light-theme-options.js');
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255)
      .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const ratio = (1.05) / (luminance(palette.primary.main) + 0.05);
  assert.ok(ratio >= 4.5, `white button text contrast was ${ratio}`);
});


test('preview returns stay on-site and cannot loop through the gate', () => {
  const { safeNextTarget } = load('src/utils/safeNextTarget.js', {}, { URL });
  assert.equal(safeNextTarget('/home?module=2'), '/home?module=2');
  for (const path of ['//example.com', '/\\example.com', '/coming-soon?next=/coming-soon', 'https://example.com', '/ /example.com']) {
    assert.equal(safeNextTarget(path), '/');
  }
});
