# Coding Style Guide

This document extends on [https://github.com/airbnb/javascript](Airbnbs) style guide with project specific needs and preferences. Most of it is covered by the linter, the rest needs to be ensured manually.

## JavaScript

1. Always prefer pure functions as much as possible.

## React components

1. Keep components small. 100 LOC is the golden number.
1. All callbacks should be named `onSomething`. Redux action creators should be mapped from `createSomeReduxAction` to `onSomeAction`. Name should rely on components context: for e.g. if components name is `FavoriteButton`, callback name should be simply `onClick` instead of `onFavoriteButtonClick`. That component already knows its context.
1. Always use functional components when you don't need hooks or `PureComponent`.
1. Don't use `PropTypes.object` when possible, use `PropTypes.shape()` and describe properties you use within that component.
1. Avoid creating objects within render and passing them to the child. Try to use static refs as much as possible.
1. Pass props to the child explicitly, avoid using spread operator here as much as possible.
1. Use react-styleguidist to work on public components - components which provide interface to the rest of the application. Don't do so with private components which are only used inside of that parent.
1. Make public components easy to use in styleguidist by leveraging the default props. For e.g. all callbacks should be optional. Don't use default props much in private components.
1. Each public render component should have a directory in src/components and export its API from index.js.
1. Use constants.js and utils.js file in each component directory to share code/variables between private components. Export public constants and utils from index.js.

## Redux

1. All action creators are named as a verb, for e.g. `doSomething`.
1. Make each action as atomic and small as possible.
1. As long as we do side effects in actions, always dispatch an action before the side effect.

## Intl

1. Always use description field. Describe where and for what that wording is used.

## JSS

1. Put your styles into component file.
1. Declare styles first, component second.
1. Use expanded objects and array values as much as possible, don't use compound values as a string.
For e.g. use `[1, 'solid', 'red']` instead of `1px solid red`.
1. Use numeric values if they are in `px`.
1. Avoid using jss-nested.
1. Always use zIndex utility for z-index.
1. Don't declare multiple classes on one element manually. Use jss-compose.
1. Use function values instead of conditional class names within render.
1. Don't use `sheet` prop, use  `classes`.
1. Don't cascade selectors into the child component.

## Theming

1. Use theming function instead of directly requiring the theme object. It allows you to use a theme based on the context.

```js
const styles = (theme) => ({
  button: {
    color: 'red'
  }
})
```

1. Ubergrape theme is a superset of material-ui theme. Meaning, ubergrape theme is based on mui theme, but with additions and modifications.
