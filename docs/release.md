# Release

Releasing a new version is pretty straightforward and similar to how you would do that for any other repo.

## Production

Main branch is `master`.

## Release checklist

To release a new version of the repo make sure to complete the following steps (in order):

- [ ] Make sure all strings are translated on [lingohub](https://translate.lingohub.com/ubergrape-gmbh/dashboard/web-client)
  - Log into LingoHub and switch to the `Resouce Files` [tab](https://translate.lingohub.com/ubergrape-gmbh/dashboard/web-client/resources/)
  - Click on `Pull Files` to fetch the latest translation files from the Github repository
  - If no changes are indicated, everything is ok and you can proceed
  - In case of changes click `Create PR based on …`, select the master branch and merge the PR
- [ ] Create a new tag `npm version <major|minor|patch>`
- [ ] Make sure that everything is fine: `git log`
- [ ] Remove node_modules running `rm -rf node_modules` install `yarn` again
- [ ] Release on npm `npm publish`
- [ ] Push updates and tags `git push && git push --tags`

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
