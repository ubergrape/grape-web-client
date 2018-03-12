import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunk from 'redux-thunk'
import {routerReducer, routerMiddleware} from 'grape-web/lib/router'
import history from './history'
import * as reducers from '../reducers'
import detectCircular from '../middleware/detectCircular'

let store
const middleware = [
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(history))
]

if (__DEV__) {
  middleware.push(applyMiddleware(detectCircular))
}

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
