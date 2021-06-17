import { PureComponent } from 'react'
import { addBadge, removeBadge } from 'grape-web/lib/x-platform'

export default class UnreadChannels extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { amount, channel } = nextProps
    let title = 'Grape'
    if (channel.name) title = `${channel.name} ${title}`
    else if (channel.partner) title = `${channel.partner.displayName} ${title}`
    if (amount) title = `(${amount}) ${title}`
    document.title = title
    if (amount) addBadge(amount)
    else removeBadge()
  }

  render() {
    return null
  }
}
