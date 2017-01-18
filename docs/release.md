# Release

Releasing a new version is pretty straightforward and similar to how you would do that for any other repo.

## Production

We have two main branches: `master` and `production`.

Some commits can be on `master` but not ready for `production` yet – that's up to you.

Most of the times though `production` and `master` are identic.

## Release checklist

To release a new version of the repo make sure to complete the following steps (in order):

- [ ] Update the [CHANGELOG](../CHANGELOG.md)
- [ ] Add release version and date to [CHANGELOG](../CHANGELOG.md) eg. Release XX.XX.XX (2017-XX-XX)
- [ ] Create a new tag `npm version <major|minor|patch>`
- [ ] Make sure that everything is fine: `git log HEAD^.. && git tag -l`
- [ ] [Create a PR against `production`](https://github.com/ubergrape/grape-web-client/compare/production?expand=1)

Once the PR is merged

- [ ] Push the tags `git push --tags`
- [ ] Release on npm `npm publish`

## Use the new release on "chatgrape"

On the `chatgrape` repo:

- [ ] Update the CHANGELOG – exclude information about `chore` changes here
- [ ] Update the version of grape-web-client in `client/version.txt` to reflect the one you just published
- [ ] Create a PR onto master and ask someone to review

## Hotfixes

Sometimes you may need to deploy an hotfix or some commits from `master` but don't want to include all the recent chances that have been made since the last release.

In this case you can:

- [ ] Switch to `production`
- [ ] Cherry-pick the relevant commits from `master`
- [ ] Repeat the steps from [Release checklist](#release-checklist) but this time from the `production` branch

Once you are done make sure you merge `production` into `master` so that `master` is up to date.
