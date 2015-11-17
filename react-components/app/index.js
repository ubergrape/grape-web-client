import store from './store'
import channelSearchInit from '../channel-search'
import subscriptionWarningInit from '../subscription-warning'

channelSearchInit(
  store,
  document.body.appendChild(document.createElement('grape-channel-search'))
)

subscriptionWarningInit(
  store,
  document.body.appendChild(document.createElement('grape-subscription-warning'))
)
