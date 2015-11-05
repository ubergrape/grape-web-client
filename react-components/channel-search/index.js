import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import ChannelSearch from './ChannelSearch'
import channelSearchReducers from './reducers'

export default function channelSearchInit() {

  let store = createStore(channelSearchReducers)
  let searchElement = document.querySelector('grape-channel-search')

  render(
    <Provider store={store}>
      <ChannelSearch />
    </Provider>,
    searchElement
  )

}


// Register reactive element.
// if (document.registerReact) {
//   document.registerReact('grape-channel-search', ChannelSearch)
// }
