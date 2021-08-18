# Grape WebClient

[![Coverage Status](https://coveralls.io/repos/github/ubergrape/grape-web-client/badge.svg?branch=master)](https://coveralls.io/github/ubergrape/grape-web-client?branch=master)

This repo contains multiple packages, they are managed toghether with [lerna](https://lerna.js.org/) und [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

## Multi-package setup

Install lerna:
```
yarn
```

Link together local packages with lerna:
```
npx lerna bootstrap
```

## Documentation

Documentation can be found in `packages/grape-web-client/docs`:

- [Setup & Development](https://github.com/ubergrape/grape-web-client/blob/master/packages/grape-web-client/docs/development.md)
- [Release Instructions](https://github.com/ubergrape/grape-web-client/blob/master/master/packages/grape-web-client/docs/release.md)
- [Coding Guideline](https://github.com/ubergrape/grape-web-client/blob/master/master/packages/grape-web-client/docs/coding-guideline.md)

## End-to-End Testing

Testing is automated with BrowserStack

![browserstack](https://www.browserstack.com/images/layout/logo.svg)
