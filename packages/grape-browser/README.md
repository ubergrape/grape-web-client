## Grape browser - UI for displaying search results.

## Installation

```bash
yarn
yarn build
```

## Developing with grape-web-client

```sh
cd packages/grape-web-client
yarn run start:dev:all

cd packages/grape-browser
yarn run build:watch
```

## Example

[See basic example](examples/basic/index.html)

## Terminology

- service - an external service e.g. github, google drive
- facet - is a results view which can include one (e.g. github) or many services (e.g. "all")
- section - representation of results for one service (headline, objects)
- object/result - one result object from a service
- filter objects - quick filter selection objects displayed in the "queries" section
- sidebar can contain info or detail view

(c) UberGrape GmbH
