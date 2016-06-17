import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import * as reducers from '../reducers'

let store

export default function getStore() {
  if (!store) {
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
    const reducer = combineReducers(reducers)
    store = createStoreWithMiddleware(reducer)

  }

  return store
}

