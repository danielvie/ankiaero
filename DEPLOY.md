# GitHub Pages Deploy

This repo deploys with GitHub Actions from `.github/workflows/pages.yml`.

Setup in GitHub:

1. Open repository settings.
2. Go to `Pages`.
3. Set `Build and deployment` source to `GitHub Actions`.
4. Push to `main` or run `Deploy GitHub Pages` manually from Actions.

The app builds with relative asset paths, so it works under the repository's GitHub Pages path.

Expected site path:

`https://<user-or-org>.github.io/<repo-name>/`
