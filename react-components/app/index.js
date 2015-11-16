import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from '../reducers'

import channelSearchInit from '../channel-search'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const reducer = combineReducers(reducers)
const store = createStoreWithMiddleware(reducer)

channelSearchInit(
  store,
  document.body.appendChild(document.createElement('grape-channel-search'))
)

export default store
