import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerReducer, routerMiddleware } from 'grape-web/lib/router'
import mapValues from 'lodash/mapValues'
import history from './history'
import * as reducersOrStateMaps from '../reducers'
import detectCircular from '../middleware/detectCircular'

let store
const middleware = [
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(history)),
]

if (__DEV__) {
  middleware.push(applyMiddleware(detectCircular))
}

/* eslint-disable no-underscore-dangle */
if (__DEV__ && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}
/* eslint-enable no-underscore-dangle */

// Allows to export `states` and `initial` objects which descrirbe a separate
// reducer per action.
const reducers = mapValues(reducersOrStateMaps, reducer => {
  if (typeof reducer === 'function') return reducer
  const { states, initial } = reducer
  return (state = initial, { type, payload }) =>
    type in states ? states[type](state, payload) : state
})

export default function getStore() {
  if (!store) {
    const createStoreWithMiddleware = compose(...middleware)(createStore)
    const combinedReducer = combineReducers({
      ...reducers,
      router: routerReducer,
    })
    store = createStoreWithMiddleware(combinedReducer)
  }

  return store
}
