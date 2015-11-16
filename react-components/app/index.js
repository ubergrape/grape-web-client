import store from './store'

import channelSearchInit from '../channel-search'

channelSearchInit(
  store,
  document.body.appendChild(document.createElement('grape-channel-search'))
)
