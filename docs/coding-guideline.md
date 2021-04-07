# Coding Style Guide

This document extends on [Airbnb's](https://github.com/airbnb/javascript) style guide with [project specific](https://github.com/ubergrape/eslint-config) needs and preferences. Most of it is covered by the linter, the rest needs to be ensured manually.

## Folders structure

The app source code is in `src/` and adhere to the following structure:

```bash
actions    # redux's actions
app        # app container
components # react render components
  images   # local components images
  tests
  index.js
constants  # app constants, for e.g. redux's
containers # react container components connected to the Redux store
fonts      # web fonts
i18n       # contains translations
images     # static assets (images)
middleware # redux's middlewares
reducers   # redux's reducers
selectors  # redux's selectios
sounds     # static assets (sounds)
themes     # static themes, e.g. colors
utils      # general purpose utils
index.js   # app entry point
```

### Folders and files name convention

- Folder names are in
  [kebab (yumm) case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles)
  e.g. `my-component`
- File names are
- in `camelCase`
- starts with `UpperCase` if they export a single `class` or `Component` or
  a stateless functional React component
- `utils.js` is a module in a component folder that contains (guess what?)
  utilities of any kind for the component.

To differentiate between "private" and "public" modules every folder must
include an `index.js` entry module that exports all of the public accessible
modules e.g.:

```javascript
export constants from './constants'
export MyComponent from './MyComponent'
export { someFunction } from './utils'
```

### `components` folder conventions

- `actionNames.js` exports an array of Redux `actions` that will be passed to the
  component as `props`
- By `default` a `ComponentName.js` should `export` a React component no matter
  if it is a stateless functional one or a `class` that extends `React.Component`.
  Obviously the module can contain internal/private stuff like helper functions,
  constants, pretty much anything really.
- one component folder `my-component` could contain multiple components files that is used by `MyComponent`, they could be in component root or in separate folder if they could be grouped by any meaning, for example:
  - `./src/editable-text` contains `EditableText.js` and `Editable.js` which is used by `EditableText.js`
  - `./src/message-parts` contains a number of components used together or separately and few components grouped in `./src/message-parts/attachments` because they have a common purpose.

## Naming entities

- `channel` and `channels` — all kind of chats: private or group, current word that describes it in UI is `Conversation` and `Conversations`
- `room` and `rooms` - is channel with `type: 'room'`, represents group/room chat, current word that describes it in UI is `Group Conversation` and `Group Conversations`, or just `Conversation`, i.e. `Search only this conversation`
- `pm` and `pms` - is channel with `type: 'pm'`, represents private chat, current word that describes it in UI is `Private Conversation` and `Private Conversations`, or just `Conversation`, i.e. `Search only this conversation`

## `containers` folder for connected components

React components connected to the Redux store are in the top level folder
`src/containers`. You can read more about this pattern on
[Dan Abramov's blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.nkvpgjq0q)

N.B. We are moving all the connected components to this folder.
Since this is still an ongoing process you might want to look at the following
folders if you are searching for a connected component but can't find it:

```bash
components/redux-component-name/ComponentNameProvider.js
components/component-name/ComponentNameProvider.js
```

## Comments

- Start sentences with an uppercase letter and terminate the period
  with a dot `.`.
- Use multiline comments when a function or a class is in the top scope
  of a module
- Use single line comments in nested scopes or inside of some block.

```javascript
// Recommended

/**
 * My function does this and this.
 */
function something() {
  // This comment allows us to comment out the entire parent function easily.
  function somethingElse {
  }

  // Just example.
  var something2 = 1
}
```

- Use code marks:
  - "TODO" something needs to be done but its not urgent, code can be merged.
  - "FIXME" something needs to be done before it gets merged into production.

If possible reference the github issue when leaving a TODO or FIXME.

## JavaScript

1.  Always prefer pure functions as much as possible.

## React components

1.  Keep components small. 100 LOC is the golden number.
1.  All callbacks should be named `onSomething`. Redux action creators should be mapped from `createSomeReduxAction` to `onSomeAction`. Name should rely on components context: for e.g. if components name is `FavoriteButton`, callback name should be simply `onClick` instead of `onFavoriteButtonClick`. That component already knows its context.
1.  Always use functional components when you don't need hooks or `PureComponent`.
1.  Don't use `PropTypes.object` when possible, use `PropTypes.shape()` and describe properties you use within that component.
1.  Avoid creating objects within render and passing them to the child. Try to use static refs as much as possible.
1.  Pass props to the child explicitly, avoid using spread operator here as much as possible.
1.  Each public render component should have a directory in src/components and export its API from index.js.
1.  Use constants.js and utils.js file in each component directory to share code/variables between private components. Export public constants and utils from index.js.

## Redux

We use Redux to manage our application state.
State is global and the
[Single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth)
pattern applies for the whole application.

Since state is global it can be consumed by multiple components and portion of
it should be referenced rather than cloned/duplicated.

Reference can be done by using IDs for example.

We can then use [selectors](#selectors) to get an [aggregated] slice of the
state.

Please keep in mind that Redux only holds global and shared application state.

Per-instance component state should be local instead. For example form input
values, or a dropdown shown/hidden state should be local.

1.  All action creators and actions are named as a verb, for e.g. `doSomething` and `DO_SOMETHING`.
1.  Make each action as atomic and small as possible.
1.  As long as we do side effects in actions, always dispatch an action before the side effect.

### Actions

> Actions are payloads of information that send data from your application to
> your store. They are the only source of information for the store. You send them
> to the store using store.dispatch()

- Actions are plain JavaScript objects.
- Actions must have a `type` property that indicates the type of action being
  performed.
- `type`s should typically be defined as string constants

```javascript
// constants/actionTypes.js

export const ADD_TODO = 'ADD_TODO'
```

```javascript
{
  type: types.ADD_TODO,
  payload: someData
  // , text: 'Build my first Redux app'
}
```

Where `payload` is optional data that you may want to send to the store.
It's a good idea to pass as little data in each action as possible – remember
that you already have all the application state in the store and you can use
[selectors](#selectors) to get slices of it.

```js
// NOT recommended

// Action Creator
export function showOrgInvite() {
  return {
    type: types.SHOW_ORG_INVITE,
    payload: {
      ...currentOrgInviteState,
      show: true,
    },
  }
}

// Reducer
switch (action.type) {
  case types.SHOW_ORG_INVITE:
    return { ...action.payload }
  // ...
}
```

```js
// Recommended

// Action Creator
export function showOrgInvite() {
  return {
    type: types.SHOW_ORG_INVITE,
  }
}

// Reducer
// ...
switch (action.type) {
  case types.SHOW_ORG_INVITE:
    return { ...state, show: true }
  // ...
}
```

Because actions are like instructions, `type` constants should be `verb-first`
e.g:

- BAD: `ON_NEW_CHANNEL`, `CHANNEL_UPDATED`
- GOOD: `SET_NEW_CHANNEL`, `UPDATE_CHANNEL`

Actions are used for:

- being called from Component
- doing API requests
- calculating payload for reducer to update

To calculate payload for reducers Actions may:

- use current state a lot
- change API response to normalize data
- call other actions depends on whatever: API response, calculations etc...
- call `reduxEmitter` methods, which is helper to connect with legacy codebase

### Reducers

- reducers are separated by state chunks they are working with
- reducers are pure functions and should not have any access to the current app state.
- you should keep data in state chunk that is used by the reducer as simple as possible and try to keep only data is needed by Component(s) that use this reducer, so **all data should be calculated in `actions` and reducer is responsible for update the state based on this data**
- don't store in reducer's state chunk information that is required by component, but available in another state chunk, use `selectors` for this purpose:
  - BAD: if `MyComponent` requires `currentChannel` you can subscribe reducer `myStateChunk` to the `SET_CHANNEL` action and save `currentChannel` to the `state.myStateChunk`
  - GOOD: use combined `selector` that take `state.currentChannel` from `currentChannelSelector` and `state.myStateChunk` and pass this data to `MyComponent`.
  - ! this rule has exception: if you need some **primitive** value to update state, e.g. find entity by `id` to update and same `id` is required by `MyComponent` it looks reasonable to store this as `state.myStateChunk.currentChannelId` on `SET_CHANNEL` action.
- it is obvious, but **if some state is changed by reducer it should return new state object**, so usually it looks like

```js
case types.UPDATE_PROP:
return {...state, prop: action.payload}
```

and deep update:

```js
case types.UPDATE_ITEM_PROP:
const {id, prop} = action.payload
return {
  ...state,
  items: state.items.map(item => {
      if (id === item.id) return {...item, prop}
      return item
  })
}
```

### Selectors

We use [reselect](https://github.com/reactjs/reselect) a selector libary for
Redux.

- Selectors can compute derived data, allowing Redux to store the minimal
  possible state.
- Selectors are efficient. A selector is not recomputed unless one of its
  arguments change.
- Selectors are composable. They can be used as input to other selectors.
- Selectors are executed after reducers, right before data is passed to
  components.

We still don't have strong conventions around naming selectors.

For now we're trying to stick the following rules:

- `propSelector` where `prop` is `state.prop` and usually same as reducer name
  and same as component name, but not always

When a component `Baz` needs two portions of the `state` say `state.foo` and
`state.bar` and we already have `fooSelector` and `barSelector` then you may
want to be a bit creative there and pick a name that makes sense for the use
case e.g. `fooAndBarSelector`, `bazSelector`, `bazComponentSelector`.

TODO: come up with a robust naming convention

Obviously to fully benefit of the selectors' power we better use a single global
state. As mentionend before we can combine selectors to get a slice of the state
for example:

We keep one list of `channels` entities but we need only a subset of them,
say the one whose `type` is `room`.

So we can use a `roomsSelector` that uses `channelsSelector` and returns a
filtered list of channels where:

```javascript
channel.type === 'room'
```

Than maybe we want to retrieve only the rooms that have the `joined` property
set to `true`. Following the same approach as above we can create a
`joinedRoomsSelector`.

If, for example, we need to count the joined rooms in `FooComponent` then we can
use `joinedRoomsSelector` in `fooComponentSelector` as follow:

```javascript
export const fooComponentSelector = createSelector(
  [joinedRoomsSelector, someOtherSelector, anotherSelector],
  (rooms, other, another) => ({
    other,
    another,
    amount: rooms.length,
  }),
)
```

In conclusion, you can combine any number of existing selectors and this is
a quite common situation. Even when a component doesn't have an entry in the
global state you can still use selectors to retrive chunks of global store data,
and even combine many of them.

## Intl

1.  Always use description field. Describe where and for what that wording is used.

## JSS

1.  Put your styles into component file.
1.  Declare styles first, component second.
1.  Use expanded objects and array values as much as possible, don't use compound values as a string.
    For e.g. use `[1, 'solid', 'red']` instead of `1px solid red`.
1.  Use numeric values if they are in `px`.
1.  Avoid using jss-nested.
1.  Always use zIndex utility for z-index.
1.  Don't declare multiple classes on one element manually. Use jss-compose.
1.  Use function values instead of conditional class names within render.
1.  Don't use `sheet` prop, use `classes`.
1.  Don't cascade selectors into the child component.

### Theming

1.  Use theming function instead of directly requiring the theme object. It allows you to use a theme based on the context.

```js
const styles = theme => ({
  button: {
    color: 'red',
  },
})
```

1.  Ubergrape theme is a superset of material-ui theme. Meaning, ubergrape theme is based on mui theme, but with additions and modifications.
