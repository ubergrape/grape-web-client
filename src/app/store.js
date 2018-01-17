import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunk from 'redux-thunk'
import {routerReducer, routerMiddleware} from 'react-router-redux'
import * as reducers from '../reducers'
import history from './history'

let store

const middleware = [
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(history))
]

/* eslint-disable no-underscore-dangle */
if (__DEV__ && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}
/* eslint-enable no-underscore-dangle */

export default function getStore() {
  if (!store) {
    const createStoreWithMiddleware = compose(...middleware)(createStore)
    const combinedReducer = combineReducers({...reducers, router: routerReducer})
    store = createStoreWithMiddleware(combinedReducer)
  }

  return store
}
