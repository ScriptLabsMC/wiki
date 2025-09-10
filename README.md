[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Wiki

Developer quickstart

1. Serve the site locally (the project uses port 5500 by default):

```powershell
# from repo root
npm ci
npm run start-server
```

Open http://127.0.0.1:5500 in your browser.

2. Generate manifests (templates/components)

```powershell
python tools/generate_manifests.py
```

This writes `templates/index.json` and `components/index.json` used by the FilesFinder client.

3. Run smoke tests (requires Playwright browsers installed):

```powershell
npx playwright install --with-deps
npm run smoke
```

CI

- `/.github/workflows/generate-manifests.yml` regenerates manifests on push/PR and commits changes.
- `/.github/workflows/smoke-test.yml` runs the smoke tests on PRs and pushes to `master`.

Notes

- The `package.json` and Playwright setup are for local/CI tooling only and do not affect the static site runtime on Vercel.
- Keep manifests updated; the generator script can be run locally and is run automatically in CI.
