# Security key rotation and Git history purge plan

Status: **NOT EXECUTED.** This is an operator plan only. No key has been revoked, no Passport key has been regenerated, and no Git history has been rewritten. Destructive steps require explicit confirmation and a maintenance window.

Current verified refs as of 2026-11-22 (for the deployment-pin update in Phase 4): canonical backend worktree `/tmp/opencode/backend-market-profiles`, `backend/main` at `1934e0fb`; canonical frontend worktree `/tmp/opencode/aduanefie-market-frontend`, `origin/main` at `9b8dd57`. Both remotes were fetched, merged, pushed and re-fetched to 0 ahead / 0 behind. The remote secret blobs listed below are still present in history; these new tips do not change that.

## Facts established on 2026-11-21

- Both GitHub remotes are public:
  - `johnsonsemmanuel/aduanefie` (frontend/root monorepo remote): `PUBLIC`
  - `johnsonsemmanuel/aduanefie-backend` (canonical backend remote): `PUBLIC`
- Canonical deployed backend is `/tmp/opencode/backend-group-buy`. Its `backend/main` is at `02c98c01217d33b1384dac1bfad2f45ca78d2a60`, and its HEAD has no `.p8`, OAuth private key, or OAuth public key.
- Frontend is `Aduanefie/frontend`. Its `origin/main` is at `419aa70abf2df75ea225cb5dc2bc97328c81d6b3`. The V6 commit `182faf4f95409e33531dd3b512acc0fd2e3fd935` is an ancestor, `git grep` at HEAD confirms the sanitizer wiring remains, and HEAD has no `.p8`, `.key`, or `.sql` secret file.
- Local root monorepo `main` is at `04b978fd066efd3a53b77713e4f723461b386d56`, 84 commits ahead of its remote, and still tracks `backend/app/Library/AuthKey_U7KA7F82UM.p8` at HEAD. It must not be pushed wholesale.
- Secret paths present in history:
  - Apple key: `app/Library/AuthKey_U7KA7F82UM.p8`, `backend/app/Library/AuthKey_U7KA7F82UM.p8`, `soft/app/Library/AuthKey_U7KA7F82UM.p8`
  - Passport: `storage/oauth-private.key`, `storage/oauth-public.key`
  - Environment: `.env.railway` (historical `APP_KEY`)
- Known blob hashes to verify during purge:
  - Apple private key: `4c5da9ea53598ae94fd532531e3df8e0e53d2c3d`
  - Passport private key: `484235188da758d2a7494ceda055d21db4642dee`
  - Passport public key: `bfe8331154db72f7d754369dddab1b0d512b81c1`
  - Historical `.env.railway`: `802a251643b8092fad6736ed246ea194afacd2c4`
- `git-filter-repo` and BFG are not installed locally. `gh` is available. Do not use deprecated `git filter-branch`.
- No runtime/database access was available during the audit, so production key state and token revocation must be confirmed by the operator.

## Ground rules

1. Rotate credentials first, purge history second. A history rewrite does not revoke a key.
2. Treat every listed key as compromised because the repositories are public.
3. Fail closed. If any confirmation step cannot be completed, stop and report the blocker.
4. Do not push the local root monorepo branch. Rewrite remote refs from fresh mirror clones of the remote branches only.
5. Keep local mirror backups offline. Never push backup refs containing secrets to a remote.
6. GitHub forks and cached views are outside upstream control. They must be handled separately.

## Phase 0: preparation and confirmations

Required before any destructive action:

- [ ] Confirm the maintenance window and notify all collaborators.
- [ ] Freeze merges to `backend/main`, frontend `origin/main`, and root `origin/main`/`origin/master`.
- [ ] Inventory clones, forks, CI checkouts, deployment artifacts, and cached container layers.
  - `gh api repos/johnsonsemmanuel/aduanefie/forks --paginate`
  - `gh api repos/johnsonsemmanuel/aduanefie-backend/forks --paginate`
- [ ] Create local-only mirror backups and store them outside any synced workspace.
  - `git clone --mirror https://github.com/johnsonsemmanuel/aduanefie-backend.git /secure/backup/aduanefie-backend.git`
  - `git clone --mirror https://github.com/johnsonsemmanuel/aduanefie.git /secure/backup/aduanefie.git`
- [ ] Install `git-filter-repo` from its official source with integrity verification.
- [ ] Confirm the current deployed key fingerprints before changing anything:
  - `sha256sum storage/oauth-private.key`
  - `openssl rsa -in storage/oauth-private.key -pubout | sha256sum`
  - Compare against the Passport blob hashes above. If they match, the deployed key is the compromised one.

## Phase 1: revoke and replace credentials

### 1. Apple Sign In key

The code path was removed in backend commit `093e795f`, but the key itself is still compromised.

- [ ] In the Apple Developer portal, revoke Key ID `U7KA7F82UM` (`AuthKey_U7KA7F82UM.p8`). Confirm its status shows revoked.
- [ ] If Sign in with Apple is still needed, generate a replacement ES256 key with the Sign in with Apple capability, download it once, and store it only in the deployment secret store or an absolute path outside every repo and web root.
- [ ] Record the new Key ID and Team ID in the secret store, not in source.
- [ ] Confirm no deployment artifact still contains the old `.p8` file.

### 2. Laravel Passport keys and all tokens

- [ ] Back up the production database and current `storage/oauth-*.key` files locally.
- [ ] Generate new keys on the production host:
  - `php artisan passport:keys --force`
- [ ] Confirm the new private key fingerprint differs from `484235188da758d2a7494ceda055d21db4642dee`.
- [ ] Revoke all existing access and refresh tokens. This signs out every user and vendor:
  - `php artisan tinker --execute="DB::table('oauth_access_tokens')->update(['revoked' => 1]); DB::table('oauth_refresh_tokens')->update(['revoked' => 1]);"`
- [ ] Restart PHP-FPM, queue workers, and any process that cached the old key.
- [ ] Verify that a known old Bearer token now returns 401 on a protected API route, and that a freshly issued token works.
- [ ] Confirm `docker-entrypoint.sh` does not regenerate or overwrite the new keys. If storage is ephemeral, mount `storage/oauth-private.key` and `storage/oauth-public.key` from the secret store instead of relying on boot-time generation.

### 3. Other secrets exposed in history

- [ ] Historical `.env.railway` contained a real-looking `APP_KEY`. Audit evidence indicated the current production key differs, but if any environment ever used it, rotate with `php artisan key:generate --force` and plan for invalidated encrypted cookies/sessions and encrypted columns.
- [ ] Replace real-looking `APP_KEY` values in `.env.example` and `.env.production.example` with empty placeholders.
- [ ] Rotate the database password if the moved SQL dump ever left the trusted machine.
- [ ] Delete the local expired `VERCEL_OIDC_TOKEN` from `Aduanefie/frontend/.env.local` and re-login with `vercel login` when needed. It is ignored by Git and has no commit history.

## Phase 2: confirm rotation before rewriting

Do not proceed until all of these are true:

- [ ] Apple portal shows the old key revoked.
- [ ] Old Passport token rejected; new Passport token accepted.
- [ ] New Passport private key fingerprint is different from the compromised blob.
- [ ] `APP_KEY` decision recorded (rotated, or documented as never used in any deployed environment).
- [ ] Operator log records the date, actor, old/new key fingerprints, and affected systems. Keep this log outside the repos.

## Phase 3: purge Git history

Work only from fresh mirror clones. These commands rewrite all refs and tags in the mirror; validate on the local mirror before any push.

### Backend remote (`backend/main`)

```bash
git clone --mirror https://github.com/johnsonsemmanuel/aduanefie-backend.git /secure/purge/backend.git
cd /secure/purge/backend.git
git filter-repo --invert-paths \
  --path app/Library/AuthKey_U7KA7F82UM.p8 \
  --path backend/app/Library/AuthKey_U7KA7F82UM.p8 \
  --path soft/app/Library/AuthKey_U7KA7F82UM.p8 \
  --path storage/oauth-private.key \
  --path storage/oauth-public.key \
  --path .env.railway
```

### Root/monorepo remote (`origin/main` and `origin/master`)

Build this from the fresh mirror of `johnsonsemmanuel/aduanefie`, **not** from the local 84-commit-ahead root `main`.

```bash
git clone --mirror https://github.com/johnsonsemmanuel/aduanefie.git /secure/purge/root-remote.git
cd /secure/purge/root-remote.git
git filter-repo --invert-paths \
  --path app/Library/AuthKey_U7KA7F82UM.p8 \
  --path backend/app/Library/AuthKey_U7KA7F82UM.p8 \
  --path soft/app/Library/AuthKey_U7KA7F82UM.p8 \
  --path storage/oauth-private.key \
  --path storage/oauth-public.key \
  --path .env.railway
```

### Frontend remote

No rewrite is needed: frontend HEAD and history were scanned and no secret paths were found. Re-run the scan below as a final check.

### Verify each rewritten mirror before pushing

```bash
# Path history must be empty for every listed path.
git log --all --full-history --oneline -- app/Library/AuthKey_U7KA7F82UM.p8
git log --all --full-history --oneline -- storage/oauth-private.key

# Known compromised blobs must be absent from all reachable objects.
git rev-list --objects --all | grep -E '4c5da9ea53598ae94fd532531e3df8e0e53d2c3d|484235188da758d2a7494ceda055d21db4642dee|bfe8331154db72f7d754369dddab1b0d512b81c1|802a251643b8092fad6736ed246ea194afacd2c4'

# Broad private-key header scan over all revisions.
git grep -n -I -E 'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY' $(git rev-list --all) -- . || true
```

Expected result: no path history, no known blob hashes, no private-key headers. If anything is found, fix the filter and repeat before pushing.

Add a regression guard in each repo so these paths cannot return: `*.p8`, `*.key`, `*.sql`, `.env`, `.env.*`, and a CI grep for private-key headers.

## Phase 4: coordinated force-push

- [ ] Announce the exact cutover time and require collaborators to re-clone afterwards.
- [ ] Force-push the rewritten backend mirror to **backend** remote only:
  - From `/secure/purge/backend.git`: `git push --force --mirror https://github.com/johnsonsemmanuel/aduanefie-backend.git`
- [ ] Force-push the rewritten root mirror to the **root** remote only:
  - From `/secure/purge/root-remote.git`: `git push --force --mirror https://github.com/johnsonsemmanuel/aduanefie.git`
- [ ] Do **not** push the local root `main` or `master` branch. Do not push local-only branches to either remote.
- [ ] Update deployment pins, CI refs, Docker build args, and documentation to the new commit SHAs.
- [ ] Re-clone deployment and CI checkouts from the rewritten remotes.
- [ ] Ask fork owners to delete their forks or rebase/reset from the rewritten upstream. Upstream cannot purge forks.
- [ ] Invalidate CDN, container, and CI caches that may hold old source layers.

## Phase 5: post-purge verification and reporting

- [ ] `git ls-remote --heads` shows the new rewritten SHAs on both remotes.
- [ ] Fresh clone of each remote passes the same blob/path/header scans from Phase 3.
- [ ] GitHub secret scanning and code search show no hits for the old key IDs or private-key headers. Search results may lag.
- [ ] Production smoke test: user login, vendor login, token issuance, protected API call, old token rejection.
- [ ] Update `SECURITY_AUDIT.md` with the actual commands, new SHAs, fingerprints, dates, and any residual gaps.
- [ ] Record explicitly if any fork, clone, or cache could not be purged.

## Rollback

- Keep the local-only mirror backups until verification is complete.
- If the rewrite breaks history or deployments, restore from the local mirror backup with a coordinated force-push, then re-plan. Restoring reintroduces the exposed history, so it is a last resort.
- Never push a backup ref or backup mirror to a public remote.

## Confirmation needed before execution

- [ ] Approve Apple key revocation and replacement key handling.
- [ ] Approve Passport key regeneration and global token revocation (all users sign out).
- [ ] Decide whether `APP_KEY` was ever deployed from the historical `.env.railway`; rotate if uncertain.
- [ ] Approve the coordinated history rewrite and force-push for both public repos.
- [ ] Confirm who owns each clone/fork/deployment and who will re-clone after the rewrite.
- [ ] Confirm what to do with the local root monorepo HEAD that still tracks the Apple key. It must not be pushed wholesale.
