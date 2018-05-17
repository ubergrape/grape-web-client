# Release

Releasing a new version is pretty straightforward and similar to how you would do that for any other repo.

## Production

Main branch is `master`.

## Release checklist

To release a new version of the repo make sure to complete the following steps (in order):

- [ ] Make sure all strings are translated on [lingohub](https://translate.lingohub.com/ubergrape-gmbh/web-client/dashboard)
- [ ] Create a new tag `npm version <major|minor|patch>`
- [ ] Make sure that everything is fine: `git log HEAD^.. && git tag -l`
- [ ] Push the tags `git push --tags`
- [ ] Remove node_modules running `rm -rf node_modules` install `npm install` again
- [ ] Release on npm `npm publish`

## Use the new release on "chatgrape"

On the `chatgrape` repo:

- [ ] Update the CHANGELOG – exclude information about `chore` changes here
- [ ] Update the version of grape-web-client in `client/version.txt` to reflect the one you just published
- [ ] Create a PR onto `develop` and ask someone to review
