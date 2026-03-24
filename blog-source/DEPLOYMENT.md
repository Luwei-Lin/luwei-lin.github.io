# Deployment Guide

## How to Deploy

From the `blog-source/` directory:

```bash
make deploy
```

This runs two steps:
1. `make deploy-build` — builds the static site into `out/` using Docker with `NODE_ENV=production`
2. `scripts/deploy.sh` — copies `out/` to the repo root, commits, and pushes to `origin main`

GitHub Pages then serves the site at `https://luwei-lin.github.io` within ~1 minute.

### Prerequisites

- Docker running (`docker-compose` available)
- Git remote `origin` pointing to `https://github.com/Luwei-Lin/luwei-lin.github.io.git`
- Docker image built (`make build` if first time, or after dependency changes)

To verify the remote:
```bash
git remote -v
```

To fix if wrong:
```bash
cd /path/to/luwei.github.io
git remote set-url origin https://github.com/Luwei-Lin/luwei-lin.github.io.git
```

---

## Architecture

- Source lives in `blog-source/`
- Build output goes to `blog-source/out/`
- `deploy.sh` copies `out/` contents to the repo root (`../`)
- GitHub Pages serves from `main` branch root

---

## Known Issues and Fixes

### 1. Build fails: `TypeError: Cannot read properties of null (reading 'useContext')`

**Cause:** A server-side import chain pulls `@react-pdf/renderer` (or `react-syntax-highlighter`) into the SSR bundle. These packages call React hooks at module initialization, which crashes during static prerendering.

**Fix:** Ensure no server component imports these packages directly. All usage must be behind `dynamic(..., { ssr: false })`. The webpack alias in `next.config.js` stubs `@react-pdf/renderer` server-side — do not remove it.

### 2. Build fails: `<Html> should not be imported outside of pages/_document`

**Cause:** `NODE_ENV=development` was set in the Docker environment, conflicting with Next.js production static rendering of the `/500` page.

**Fix:** `make deploy-build` explicitly passes `-e NODE_ENV=production` to override. Do not remove this flag from the Makefile.

### 3. `deploy.sh` fails: `set: -: invalid option`

**Cause:** The script has Windows CRLF line endings (`\r\n`).

**Fix:**
```bash
sed -i '' 's/\r//' blog-source/scripts/deploy.sh
```

### 4. Site is 404 on GitHub Pages

**Possible causes:**

- **Repo is private:** GitHub Pages on free accounts requires a public repo. Go to repo Settings → Danger Zone → Change visibility → Make public.
- **Repo name mismatch:** For a user Pages site at `https://<username>.github.io`, the repo must be named exactly `<username>.github.io`. Username `Luwei-Lin` requires repo name `luwei-lin.github.io`.
- **Pages not configured:** Go to repo Settings → Pages → set Source to "Deploy from a branch", Branch: `main`, Folder: `/ (root)`.
- **Just renamed the repo:** GitHub Pages re-deploys after a rename. Wait ~1 minute.

### 5. Docker build uses stale `node_modules` after changing `package.json`

**Cause:** `node_modules` is baked into the Docker image at build time (`RUN npm install` in Dockerfile). Running `npm install` inside a container does not persist.

**Fix:** Rebuild the image after any dependency change:
```bash
make rebuild
```

### 6. Git push fails after repo rename

**Cause:** Local `origin` remote still points to the old repo name.

**Fix:**
```bash
cd /path/to/luwei.github.io
git remote set-url origin https://github.com/Luwei-Lin/luwei-lin.github.io.git
```
