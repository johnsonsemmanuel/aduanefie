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

const navigation = load('src/utils/marketplaceNavigation.js');
const entry = load('pages/index.js', { 'utils/marketplaceNavigation': navigation });
const context = (query = {}, cookies = {}) => ({ query, req: { cookies } });

test('fresh Home enters a real shopping catalogue', async () => {
  assert.equal((await entry.getServerSideProps(context())).redirect.destination, '/home?module=2');
});
test('explicit market choice overrides a stale cookie', async () => {
  assert.equal((await entry.getServerSideProps(context({ module: '1' }, { selectedModule: '2' }))).redirect.destination, '/home?module=1');
});
test('returning shoppers and legacy links retain their selected catalogue', async () => {
  for (const input of [context({}, { selectedModule: '4' }), context({ module_id: '4' })]) {
    assert.equal((await entry.getServerSideProps(input)).redirect.destination, '/home?module=4');
  }
});
test('malformed module choices fall back safely without external redirects', async () => {
  for (const module of ['garbage', '//example.com', {}, 'undefined', '0', '-1']) {
    assert.equal((await entry.getServerSideProps(context({ module }))).redirect.destination, '/home?module=2');
  }
});
test('shopping and farming destinations have distinct active navigation', () => {
  for (const path of ['/home', '/home/nearby', '/search', '/store/12']) {
    assert.equal(navigation.isMarketplaceRoute(path), true);
    assert.equal(navigation.isFarmsRoute(path), false);
  }
  for (const path of ['/farms', '/live-farming']) {
    assert.equal(navigation.isFarmsRoute(path), true);
    assert.equal(navigation.isMarketplaceRoute(path), false);
  }
  assert.equal(navigation.isMarketplaceRoute('/store-registration'), false);
  assert.equal(navigation.getMarketplaceHref(undefined, '6'), '/home?module=6');
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


test('farm discovery retains produce markets and avoids unrelated equipment/service scopes', () => {
  assert.equal(navigation.getFarmingModule('1'), '1');
  assert.equal(navigation.getFarmingModule('2'), '2');
  for (const module of ['4', '5', '6', undefined, 'grocery']) {
    assert.equal(navigation.getFarmingModule(module), '2');
  }
});
