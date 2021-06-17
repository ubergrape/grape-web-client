# Release

Releasing a new version is pretty straightforward and similar to how you would do that for any other repo.

## Production

Main branch is `master`.

## Release checklist

To release a new version of the repo make sure to complete the following steps (in order):

- [ ] Update translations
  - Make sure all strings are translated on [lingohub](https://translate.lingohub.com/ubergrape-gmbh/dashboard/web-client)
  - Push them to Github as PR to make sure we have the latest data: Go to [Repository -> Export/Import](https://translate.lingohub.com/ubergrape-gmbh/dashboard/web-client/repository/export-import) and click "Push".
  - Merge the PR
  - Pull the changes locally and run `yarn i18n:import`
- [ ] To release v4.0.0 for example, run `./bin/release.sh 4.0.0` and `./bin/release.sh 4.0.0-unicorn`.

Note: The environment variables for the unicorn release will be set automatically if the release version ends with "unicorn".

## Environment variable

### THEME variable

To release/debug a version with a special theme, make sure to include `THEME` environment variable.
E.g `THEME=name npm publish`. Names of themes for companies you can find in internal Notion wiki:
https://www.notion.so/grape/Customer-themes-8fdfc74c9e1f4c09aebbab8f4404954f

The version of release should match with default version, but the theme name ending should be added at the end, like `1.14.0-name`.

### PRODUCT_NAME variable

To replace `Grape` (used by default) product name to another one, use `PRODUCT_NAME` environment variable while releasing/debugging.
E.g `PRODUCT_NAME='Grain' npm publish`.

## Use the new release on "chatgrape"

On the `chatgrape` repo:

- [ ] Update the CHANGELOG – exclude information about `chore` changes here
- [ ] Update the version of grape-web-client in `client/version.txt` to reflect the one you just published
- [ ] Create a PR onto `develop` and ask someone to review
