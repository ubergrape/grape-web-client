import { PureComponent } from 'react'
import { addBadge, removeBadge } from 'grape-web/lib/x-platform'

export default class UnreadChannels extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { amount, channelName, partnerName } = nextProps
    let title = 'Grape'
    if (channelName) title = `${channelName} ${title}`
    else title = `${partnerName} ${title}`
    if (amount) title = `(${amount}) ${title}`
    document.title = title
    if (amount) addBadge(amount)
    else removeBadge()
  }

  render() {
    return null
  }
}
