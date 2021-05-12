import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers'

let store

const composition = [applyMiddleware(thunk)]

/* eslint-disable no-underscore-dangle */
if (__DEV__ && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
  composition.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}
/* eslint-enable no-underscore-dangle */

export default function getStore() {
  if (!store) {
    const createStoreWithMiddleware = compose(...composition)(createStore)
    const reducer = combineReducers(reducers)
    store = createStoreWithMiddleware(reducer)
  }

  return store
}
