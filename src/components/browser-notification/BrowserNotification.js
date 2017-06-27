import PropTypes from 'prop-types'
import {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import {createNotification} from 'grape-web/lib/x-platform'
import MarkdownIt from 'markdown-it'
import mdEmoji from 'markdown-it-emoji'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import mdForcebreak from '../../utils/markdown-it-plugins/forcebreak'
import mdNotification from '../../utils/markdown-it-plugins/notification'
import {shouldNotify} from '../../utils/notifications'

const md = new MarkdownIt({breaks: true})
  .use(mdForcebreak)
  .use(mdEmoji)
  .use(mdNotification)

const messages = defineMessages({
  pm: {
    id: 'privateMessageHint',
    defaultMessage: '(Private message)',
    description: 'Browser notification private message hint.'
  },
  groupInviteTitle: {
    id: 'groupInviteNotificationTitle',
    defaultMessage: '{name} invited you to the group {group}',
    description: 'Browser notification group invite title.'
  },
  groupInviteContent: {
    id: 'groupInviteNotificationContent',
    defaultMessage: '{name} (Group Invite)',
    description: 'Browser notification group invite content.'
  }
})

const messageTypes = ['message', 'pm', 'mention', 'group_mention']

@injectIntl
export default class BrowserNotification extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    channel: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    notification: PropTypes.shape({
      dispatcher: PropTypes.oneOf([...messageTypes, 'room_invite']).isRequired,
      channel: PropTypes.shape({
        id: PropTypes.number
      }).isRequired,
      inviter: PropTypes.shape({
        avatar: PropTypes.string,
        displayName: PropTypes.string
      }),
      content: PropTypes.string
    }),
    onGoToChannel: PropTypes.func
  }

  static defaultProps = {
    channel: undefined,
    notification: undefined,
    onGoToChannel: noop
  }

  componentWillUpdate(nextProps) {
    const {notification, channel} = nextProps
    const hasChanged = notification !== this.props.notification

    if (!channel || !notification || !hasChanged) return

    const notify = shouldNotify({
      time: notification.time,
      sourceChannelId: notification.channel.id,
      currentChannelId: channel.id
    })

    if (notify) this.renderNotification(notification)
  }

  getInviteOptions({inviter, channel}) {
    const {intl: {formatMessage}} = this.props
    return {
      title: formatMessage(messages.groupInviteTitle, {
        name: inviter.displayName, group: channel.name
      }),
      content: formatMessage(messages.groupInviteContent, {name: inviter.displayName}),
      icon: inviter.avatar
    }
  }

  getNewMessageOptions(notification) {
    const {author, attachments, content: mdContent} = notification
    const title = this.renderTitle(notification)
    let content = md.render(mdContent)

    if (attachments.length) {
      if (content) content += '\n\n'
      content += attachments.map(({name}) => (name ? `${name}\n` : ''))
    }

    return {
      title,
      content,
      icon: author.iconUrl
    }
  }

  renderTitle({channel, author}) {
    const {intl: {formatMessage}} = this.props
    if (channel.type === 'room') {
      return `${author.name} (${channel.name})`
    }
    return `${author.name} ${formatMessage(messages.pm)}`
  }

  renderNotification(notification) {
    const {onGoToChannel} = this.props
    let options

    if (messageTypes.indexOf(notification.dispatcher) !== -1) {
      options = this.getNewMessageOptions(notification)
    } else {
      options = this.getInviteOptions(notification)
    }

    createNotification(options, () => {
      onGoToChannel(notification.channel.slug)
    })
  }

  render() {
    return null
  }
}
