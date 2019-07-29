import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { createNotification } from 'grape-web/lib/x-platform'
import MarkdownIt from 'markdown-it'
import mdEmoji from 'markdown-it-emoji'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import { isElectron } from 'grape-web/lib/x-platform/electron'

import mdForcebreak from '../../utils/markdown-it-plugins/forcebreak'
import mdNotification from '../../utils/markdown-it-plugins/notification'
import { shouldNotify } from '../../utils/notifications'
import { dispatchers } from '../../constants/notification'

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
  grapeCallPmInvitationContent: {
    id: 'grapeCallPmInvitationContent',
    defaultMessage: 'invites you to a Grape call …',
    description: 'Browser notification for incoming pm Grape Call.',
  },
  grapeCallPmMissedContent: {
    id: 'grapeCallPmMissedContent',
    defaultMessage: 'called you',
    description: 'Browser notification for missed pm Grape Call.',
  },
})

const md = new MarkdownIt({ breaks: true, typographer: true })
  .use(mdForcebreak)
  .use(mdEmoji)
  .use(mdNotification)

const getInviteOptions = ({
  browserNotification: { inviter, channel },
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
    browserNotification: { channel, author },
    intl: { formatMessage },
  } = props
  if (channel.type === 'room') {
    return `${author.name} (${channel.name})`
  }
  return `${author.name} ${formatMessage(messages.pm)}`
}

const getNewMessageOptions = props => {
  const { author, attachments, content: mdContent } = props.browserNotification
  const title = getMessageTitle(props)
  let content = md.render(mdContent)
  // "artificial intelligence". https://github.com/markdown-it/markdown-it/issues/460
  // https://jira.ubergrape.com/browse/GRAPE-14976?focusedCommentId=49854&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-49854
  content = content.replace(/&quot;/g, '"')

  if (attachments.length) {
    if (content) content += '\n\n'
    content += attachments.map(
      ({ name }) => (name ? `${author.name}: ${name}\n` : ''),
    )
  }

  return {
    title,
    content,
    icon: author.iconUrl,
  }
}

const getCallCallbacks = ({ dispatcher }, props) => {
  const { joinCall, onGoToChannel, channel, browserNotification, call } = props
  const {
    incoming: { channelId, grapecallUrl, callId },
  } = call

  if (dispatcher === 'incoming') {
    return {
      onClick: () => {
        window.open(`${grapecallUrl}?call_id=${callId}`)
        joinCall({
          channelId,
          callId,
        })
      },
    }
  }

  return {
    onClick: () => {
      if (channel.id !== browserNotification.channel.id) {
        onGoToChannel(browserNotification.channel.id)
      }
    },
  }
}

const getCallOptions = props => {
  const { browserNotification, intl } = props
  const { dispatcher, channel } = browserNotification

  if (dispatcher === 'incoming') {
    return {
      title: channel.name,
      content: intl.formatMessage(messages.grapeCallPmInvitationContent),
      requireInteraction: true,
      icon: channel.icon,
    }
  }

  return {
    title: channel.name,
    content: intl.formatMessage(messages.grapeCallPmMissedContent),
    icon: channel.icon,
  }
}

const normalizeNotificationData = ({ dispatcher, props, conf }) => {
  const { onGoToChannel, browserNotification, channel } = props

  if (dispatchers.invites.indexOf(dispatcher) !== -1) {
    return {
      type: 'invites',
      callbacks: {
        onClick: () => {
          if (channel.id !== browserNotification.channel.id) {
            onGoToChannel(browserNotification.channel.id)
          }
        },
      },
      options: getInviteOptions(props),
    }
  } else if (dispatchers.messages.indexOf(dispatcher) !== -1) {
    return {
      type: 'messages',
      callbacks: {
        onClick: () => {
          if (channel.id !== browserNotification.channel.id) {
            onGoToChannel(browserNotification.channel.id)
          }
        },
      },
      options: getNewMessageOptions(props),
    }
  } else if (dispatchers.calls.indexOf(dispatcher) !== -1) {
    const timeout = conf.grapecall.incomingCallTimeout * 1000
    return {
      type: 'calls',
      options: getCallOptions(props),
      callbacks: getCallCallbacks({ dispatcher }, props),
      params: { timeout },
    }
  }
  // Unexpected notification has been provided
  return undefined
}

const updateNotification = (props, nextProps) => {
  const {
    conf,
    call,
    notification,
    browserNotification: { dispatcher },
  } = nextProps

  const { type } = normalizeNotificationData({
    dispatcher,
    props,
    conf,
  })

  if (type === 'calls') {
    const { show } = call
    if (!show && show !== props.call.show && notification.close) {
      notification.close()
    }
  }
}

const renderNotification = props => {
  const { browserNotification, conf } = props
  const { dispatcher } = browserNotification

  const { options, callbacks, params } = normalizeNotificationData({
    dispatcher,
    props,
    conf,
  })

  const notification = createNotification(options, callbacks, params)
  return notification
}

class BrowserNotification extends PureComponent {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    intl: intlShape.isRequired,
    call: PropTypes.object.isRequired,
    onGoToChannel: PropTypes.func.isRequired,
    joinCall: PropTypes.func.isRequired,
    setNotification: PropTypes.func.isRequired,
    /* eslint-enable react/no-unused-prop-types */
    channel: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    browserNotification: PropTypes.shape({
      dispatcher: PropTypes.oneOf(dispatchers.all).isRequired,
      channel: PropTypes.shape({
        id: PropTypes.number,
      }).isRequired,
      inviter: PropTypes.shape({
        avatar: PropTypes.string,
        displayName: PropTypes.string,
      }),
      time: PropTypes.string,
      content: PropTypes.string,
    }),
  }

  static defaultProps = {
    channel: undefined,
    browserNotification: undefined,
  }

  componentWillUpdate(nextProps) {
    const {
      channel,
      browserNotification,
      notification,
      setNotification,
    } = nextProps

    if (!channel || !browserNotification) return

    const isNew = browserNotification !== this.props.browserNotification

    if (!isNew && notification && !isElectron) {
      // Some notifications should be update
      updateNotification(this.props, nextProps)
      return
    }

    const notify = shouldNotify({
      time: browserNotification.time,
      sourceChannelId: browserNotification.channel.id,
      currentChannelId: channel.id,
    })

    if (!isNew || !notify) return

    setNotification(renderNotification(nextProps))
  }

  render() {
    return null
  }
}

export default injectIntl(BrowserNotification)
