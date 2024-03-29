import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import {
  createNotification,
  updateNotification,
} from 'grape-web/lib/x-platform'
import MarkdownIt from 'markdown-it'
import mdEmoji from 'markdown-it-emoji'
import { defineMessages, injectIntl } from 'react-intl'
import { isElectron } from 'grape-web/lib/x-platform/electron'

import mdForcebreak from '../../utils/markdown-it-plugins/forcebreak'
import mdNotification from '../../utils/markdown-it-plugins/notification'
import { shouldNotify } from '../../utils/notifications'
import { dispatchers } from '../../constants/notification'

const messages = defineMessages({
  pm: {
    id: 'privateMessageHint',
    defaultMessage: '(Private Conversation)',
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
    defaultMessage: 'invites you to a Grape Call…',
    description: 'Browser notification for incoming pm Grape Call.',
  },
  grapeCallPmMissedContent: {
    id: 'grapeCallPmMissedContent',
    defaultMessage: 'called you',
    description: 'Browser notification for missed pm Grape Call.',
  },
})

const getDomain = str => new URL(str).hostname.replace(/^[^.]+\./g, '')

const md = new MarkdownIt({ breaks: true, typographer: true })
  .disable('list')
  .use(mdForcebreak)
  .use(mdEmoji)
  .use(mdNotification)

const getInviteProperties = ({
  browserNotification: { author, channel },
  intl: { formatMessage },
}) => ({
  title: formatMessage(messages.groupInviteTitle, {
    name: author.displayName,
    group: channel.name,
  }),
  content: formatMessage(messages.groupInviteContent, {
    name: author.displayName,
  }),
  icon: author.avatar,
})

const getMessageTitle = props => {
  const {
    browserNotification: { channel, author },
    intl: { formatMessage },
  } = props
  if (channel.type === 'room') return `${author.displayName} (${channel.name})`
  return `${author.displayName} ${formatMessage(messages.pm)}`
}

const getNewMessageProperties = props => {
  const { author, attachments, content: mdContent } = props.browserNotification
  const title = getMessageTitle(props)
  let content = md.render(mdContent)
  // "artificial intelligence". https://github.com/markdown-it/markdown-it/issues/460
  // https://jira.ubergrape.com/browse/GRAPE-14976?focusedCommentId=49854&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-49854
  content = content.replace(/&quot;/g, '"')

  if (attachments.length) {
    if (content) content += '\n\n'
    content += attachments.map(({ name }) =>
      name ? `${author.displayName}: ${name}\n` : '',
    )
  }

  return {
    title,
    content,
    icon: author.avatar,
  }
}

const getCallCallbacks = ({ dispatcher }, props) => {
  const {
    onGoToChannel,
    onCloseIncomingCall,
    endSound,
    channel,
    browserNotification,
    incomingCall,
  } = props
  const {
    data: { grapecallUrl, call },
  } = incomingCall

  if (dispatcher === 'incoming') {
    return {
      onClick: () => {
        window.open(`${grapecallUrl}?call_id=${call.id}`)
        onCloseIncomingCall()
        endSound()
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

const getCallProperties = props => {
  const { browserNotification, intl } = props
  const { dispatcher, author } = browserNotification

  if (dispatcher === 'incoming') {
    return {
      title: author.displayName,
      icon: author.avatar,
      content: intl.formatMessage(messages.grapeCallPmInvitationContent),
      requireInteraction: true,
    }
  }

  return {
    title: author.displayName,
    icon: author.avatar,
    content: intl.formatMessage(messages.grapeCallPmMissedContent),
  }
}

const normalizeNotificationData = ({ dispatcher, props, conf }) => {
  const { onGoToChannel, browserNotification, channel } = props

  if (dispatchers.invites.indexOf(dispatcher) !== -1) {
    return {
      type: 'invites',
      properties: getInviteProperties(props),
      callbacks: {
        onClick: () => {
          if (channel.id !== browserNotification.channel.id) {
            onGoToChannel(browserNotification.channel.id)
          }
        },
      },
    }
  } else if (dispatchers.messages.indexOf(dispatcher) !== -1) {
    return {
      type: 'messages',
      properties: getNewMessageProperties(props),
      callbacks: {
        onClick: () => {
          if (channel.id !== browserNotification.channel.id) {
            onGoToChannel(browserNotification.channel.id)
          }
        },
      },
    }
  } else if (dispatchers.calls.indexOf(dispatcher) !== -1) {
    const timeout = conf.grapecall.incomingCallTimeout * 1000
    return {
      type: 'calls',
      properties: getCallProperties(props),
      params: { timeout },
      callbacks: getCallCallbacks({ dispatcher }, props),
    }
  }
  // Unexpected notification has been provided
  return undefined
}

class BrowserNotification extends PureComponent {
  static propTypes = {
    setNotification: PropTypes.func.isRequired,
    browserNotification: PropTypes.shape({
      attachments: PropTypes.array,
      dispatcher: PropTypes.oneOf(dispatchers.all).isRequired,
      channel: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        name: PropTypes.string,
      }).isRequired,
      author: PropTypes.shape({
        avatar: PropTypes.string,
        displayName: PropTypes.string,
      }),
      time: PropTypes.string.isRequired,
      content: PropTypes.string,
      event: PropTypes.string.isRequired,
    }),
    conf: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    notification: PropTypes.object,
  }

  static defaultProps = {
    notification: undefined,
    browserNotification: undefined,
  }

  componentWillUpdate(nextProps) {
    const {
      channel,
      browserNotification,
      notification,
      setNotification,
    } = nextProps

    if (!browserNotification) return

    const isNew = browserNotification !== this.props.browserNotification

    if (!isNew && notification && !isElectron) {
      const {
        conf,
        browserNotification: { dispatcher },
      } = nextProps

      const { type, properties, callbacks, params } = normalizeNotificationData(
        {
          dispatcher,
          props: this.props,
          conf,
        },
      )

      // Some notifications should be update
      updateNotification({ type }, this.props, nextProps)

      if (window.top !== window.self) {
        window.parent.postMessage(
          JSON.stringify({
            type: 'grapeClient.updateNotification',
            payload: {
              args: {
                type,
                properties,
                callbacks,
                params,
              },
              props: this.props,
              nextProps,
            },
          }),
          '*',
        )
      }

      return
    }

    const {
      time,
      channel: { id },
    } = browserNotification

    const notify = shouldNotify({
      time,
      sourceChannelId: id,
      currentChannelId: channel.id,
    })

    if (!isNew || !notify) return

    const { conf } = this.props
    const { dispatcher } = browserNotification

    const { type, properties, callbacks, params } = normalizeNotificationData({
      dispatcher,
      props: nextProps,
      conf,
    })

    if (
      window.top !== window.self &&
      getDomain(document.referrer) === getDomain(window.self.location.href)
    ) {
      window.parent.postMessage(
        JSON.stringify({
          type: 'grapeClient.createNotification',
          payload: {
            args: {
              type,
              properties,
              callbacks,
              params,
            },
            props: this.props,
            nextProps,
          },
        }),
        '*',
      )
    }

    setNotification(
      createNotification({
        properties,
        params,
        callbacks,
      }),
    )
  }

  render() {
    return null
  }
}

export default injectIntl(BrowserNotification)
