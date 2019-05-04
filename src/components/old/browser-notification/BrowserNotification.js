import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import noop from 'lodash/noop'
import { createNotification } from 'grape-web/lib/x-platform'
import MarkdownIt from 'markdown-it'
import mdEmoji from 'markdown-it-emoji'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import mdForcebreak from '../../../utils/markdown-it-plugins/forcebreak'
import mdNotification from '../../../utils/markdown-it-plugins/notification'
import { shouldNotify } from '../../../utils/notifications'
import { dispatchers } from '../../../constants/notification'

const messages = defineMessages({
  pm: {
    id: 'privateMessageHint',
    defaultMessage: '(Private message)',
    description: 'Browser notification private message hint.',
  },
  groupInviteTitle: {
    id: 'groupInviteNotificationTitle',
    defaultMessage: '{name} invited you to the group {group}',
    description: 'Browser notification group invite title.',
  },
  groupInviteContent: {
    id: 'groupInviteNotificationContent',
    defaultMessage: '{name} (Group Invite)',
    description: 'Browser notification group invite content.',
  },
  grapeCallGroupInvitationContent: {
    id: 'grapeCallGroupInvitationContent',
    defaultMessage: '{callInitator} started a Grape Call in this group.',
    description: 'Browser notification group grape call.',
  },
  grapeCallPmInvitationContent: {
    id: 'grapeCallPmInvitationContent',
    defaultMessage: 'Invites you to a Grape call …',
    description: 'Browser notification pm grape call.',
  },
})

const md = new MarkdownIt({ breaks: true, typographer: true })
  .use(mdForcebreak)
  .use(mdEmoji)
  .use(mdNotification)

const getInviteOptions = ({
  notification: { inviter, channel },
  intl: { formatMessage },
}) => ({
  title: formatMessage(messages.groupInviteTitle, {
    name: inviter.displayName,
    group: channel.name,
  }),
  content: formatMessage(messages.groupInviteContent, {
    name: inviter.displayName,
  }),
  icon: inviter.avatar,
})

const getMessageTitle = props => {
  const {
    notification: { channel, author },
    intl: { formatMessage },
  } = props
  if (channel.type === 'room') {
    return `${author.name} (${channel.name})`
  }
  return `${author.name} ${formatMessage(messages.pm)}`
}

const getNewMessageOptions = props => {
  const { author, attachments, content: mdContent } = props.notification
  const title = getMessageTitle(props)
  let content = md.render(mdContent)
  // "artificial intelligence". https://github.com/markdown-it/markdown-it/issues/460
  // https://jira.ubergrape.com/browse/GRAPE-14976?focusedCommentId=49854&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-49854
  content = content.replace(/&quot;/g, '"')

  if (attachments.length) {
    if (content) content += '\n\n'
    content += attachments.map(({ name }) =>
      name ? `${author.name}: ${name}\n` : '',
    )
  }

  return {
    title,
    content,
    icon: author.iconUrl,
  }
}

const getIncomingCallOptions = props => {
  const content =
    props.notification.channel.type === 'room'
      ? props.intl.formatMessage(
          messages.grapeCallGroupInvitationContent,
          // TODO should be changed to the call initator once available
          { callInitator: props.notification.channel.name },
        )
      : props.intl.formatMessage(messages.grapeCallPmInvitationContent)

  return {
    title: props.notification.channel.name,
    content,
    icon: props.notification.channel.icon,
  }
}

const renderNotification = props => {
  const { onGoToChannel, notification, channel } = props
  let options

  if (dispatchers.invites.indexOf(notification.dispatcher) !== -1) {
    options = getInviteOptions(props)
  } else if (dispatchers.messages.indexOf(notification.dispatcher) !== -1) {
    options = getNewMessageOptions(props)
  } else if (notification.dispatcher === dispatchers.incomingCall) {
    options = getIncomingCallOptions(props)
  } else {
    // Unexpected notification has been provided
    return undefined
  }

  createNotification(options, () => {
    if (channel.id !== notification.channel.id) {
      onGoToChannel(notification.channel.id)
    }
  })
  return undefined
}

class BrowserNotification extends PureComponent {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    intl: intlShape.isRequired,
    onGoToChannel: PropTypes.func,
    /* eslint-enable react/no-unused-prop-types */
    channel: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    notification: PropTypes.shape({
      dispatcher: PropTypes.oneOf(dispatchers.all).isRequired,
      channel: PropTypes.shape({
        id: PropTypes.number,
      }).isRequired,
      inviter: PropTypes.shape({
        avatar: PropTypes.string,
        displayName: PropTypes.string,
      }),
      content: PropTypes.string,
    }),
  }

  static defaultProps = {
    channel: undefined,
    notification: undefined,
    onGoToChannel: noop,
  }

  componentWillUpdate(nextProps) {
    const { channel, notification } = nextProps

    if (!channel || !notification) return

    const isNew = notification !== this.props.notification
    const notify = shouldNotify({
      time: notification.time,
      sourceChannelId: notification.channel.id,
      currentChannelId: channel.id,
    })

    if (!isNew || !notify) return

    renderNotification(nextProps)
  }

  render() {
    return null
  }
}

export default injectIntl(BrowserNotification)
