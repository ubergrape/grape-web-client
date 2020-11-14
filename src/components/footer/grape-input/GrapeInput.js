import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import GlobalEvent from 'grape-web/lib/components/global-event'
import { debouncingTime } from 'grape-web/lib/constants/time'
import { GrapeBrowser } from 'grape-browser'
import * as emoji from 'grape-browser/lib/components/emoji'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import cn from 'classnames'

import {
  getEmojiSearchData,
  searchChannelsToMention,
  formatQuote,
} from './utils'
import { typingThrottlingDelay } from '../../../constants/delays'

const inputNodes = ['INPUT', 'TEXT', 'TEXTAREA', 'SELECT']

const messages = defineMessages({
  keyESC: {
    id: 'keyESC',
    defaultMessage: 'ESC',
  },
})

const styles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    position: 'relative',
  },
  wrapperDisabled: {
    pointerEvents: 'none',
  },
  editMessage: {
    position: 'absolute',
    opacity: 0,
    top: 0,
    left: 0,
    background: 'linear-gradient(#FBFBFB, #F7F7F7)',
    border: 'solid 1px #E5E5E5',
    borderRadius: 3,
    padding: [2, 12, 1, 12],
    transition: 'opacity 0.2s ease-out, top 0.2s ease-out',
    willChange: 'opacity, top',
    color: '#666666',
    fontSize: '0.8em',
  },
  editMessageVisible: {
    opacity: 1,
    top: -22,
  },
  editMessageButton: {
    borderRadius: 3,
    border: '1px solid #CCCCCC',
    padding: [1, 3],
    margin: [0, 2],
    color: '#666666',
    background: '#FBFBFB',
    fontSize: '100%',
  },
}

class GrapeInput extends PureComponent {
  static propTypes = {
    customEmojis: PropTypes.object,
    images: PropTypes.object.isRequired,
    org: PropTypes.object,
    conf: PropTypes.object,
    targetMessage: PropTypes.object,
    quoteMessage: PropTypes.object,
    channel: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    isPostingLimited: PropTypes.bool,
    showBrowser: PropTypes.oneOf([
      false,
      'emoji',
      'emojiSuggest',
      'user',
      'search',
    ]).isRequired,
    search: PropTypes.string,
    autocomplete: PropTypes.object,
    services: PropTypes.array,
    servicesStats: PropTypes.object,
    channelsToMention: PropTypes.array,
    onCreateMessage: PropTypes.func.isRequired,
    onUpdateMessage: PropTypes.func.isRequired,
    onSetTyping: PropTypes.func.isRequired,
    onAbortEdit: PropTypes.func.isRequired,
    onHideBrowser: PropTypes.func.isRequired,
    onEditPreviousMessage: PropTypes.func.isRequired,
    onShowEmojiBrowser: PropTypes.func.isRequired,
    onShowEmojiSuggestBrowser: PropTypes.func.isRequired,
    onShowUsersAndRoomsBrowser: PropTypes.func.isRequired,
    onShowSearchBrowser: PropTypes.func.isRequired,
    onRequestAutocomplete: PropTypes.func.isRequired,
    onRequestAutocompleteServices: PropTypes.func.isRequired,
    onRequestAutocompleteServicesStats: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    onSearchChannelsToMention: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    usersToMention: PropTypes.array,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    isPostingLimited: false,
    org: {},
    conf: {},
    targetMessage: null,
    quoteMessage: null,
    search: '',
    services: [],
    servicesStats: {},
    usersToMention: [],
    channelsToMention: [],
    customEmojis: {},
    autocomplete: {},
    permissions: {},
  }

  constructor(props) {
    super(props)
    this.previous = {}
    this.unsent = {}
    this.input = null
    this.state = {
      focused: false,
    }
  }

  componentDidMount() {
    const {
      channel: { id },
    } = this.props
    const draftMessages = this.getDraftMessages()

    if (draftMessages[id]) {
      this.input.setTextContent(draftMessages[id], { silent: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      channel: currChannel,
      targetMessage: currTargetMessage,
      quoteMessage: currQuoteMessage,
      intl,
    } = this.props

    const {
      channel: nextChannel,
      targetMessage: nextTargetMessage,
      quoteMessage: nextQuoteMessage,
    } = nextProps

    if (currChannel.id !== nextChannel.id) {
      this.onSelectChannel(currChannel, nextChannel)
    }

    if (
      nextTargetMessage &&
      (!currTargetMessage || currTargetMessage.id !== nextTargetMessage.id)
    ) {
      this.onEditMessage(nextTargetMessage)
    }

    if (nextQuoteMessage && nextQuoteMessage !== currQuoteMessage) {
      const quote = formatQuote({
        intl,
        message: nextQuoteMessage,
      })
      this.input.setTextContent(quote, { silent: true, caretPosition: 'start' })
    }
  }

  /**
   * Focus grape input to make user type in it when he started to type somewhere
   * outside, but not in some other input cabable field.
   */
  onKeyDown = e => {
    if (this.props.channel.switching) {
      e.preventDefault()
      return
    }
    // For e.g. when trying to copy text from history.
    if (e.altKey || e.ctrlKey || e.metaKey) return
    // Skip every combinination with Shift that doesn't produce a single letter.
    if (e.shiftKey && e.key.length > 1) return
    if (inputNodes.indexOf(e.target.nodeName) >= 0) return
    if (this.isPostingLimited) return
    this.focus()
  }

  onEditMessage(msg) {
    this.input.setTextContent(msg.text, { silent: true })
  }

  onSelectChannel(prev, next) {
    const { targetMessage } = this.props
    if (prev.id && !targetMessage) {
      this.saveDraftMessageToLocalStorage(this.input.getTextContent())
    }

    const draftMessages = this.getDraftMessages()
    this.input.setTextContent(draftMessages[next.id] || '', {
      silent: true,
    })
    this.focus()
  }

  onGrapeBrowserRef = ref => {
    this.input = ref
  }

  onSubmit = data => {
    const {
      targetMessage,
      onCreateMessage,
      onUpdateMessage,
      channel,
      onHideBrowser,
    } = this.props

    if (targetMessage) {
      onUpdateMessage({
        channelId: channel.id,
        text: data.content,
        message: targetMessage,
      })
    } else {
      onCreateMessage({ channelId: channel.id, text: data.content })
    }
    this.saveDraftMessageToLocalStorage('')
    onHideBrowser()
  }

  onComplete = data => {
    const { filters, search, query, trigger } = data
    const {
      org,
      channel,
      showBrowser,
      onShowSearchBrowser,
      onShowUsersAndRoomsBrowser,
      onShowEmojiSuggestBrowser,
      onShowEmojiBrowser,
      onRequestAutocomplete,
      onSearchChannelsToMention,
      permissions,
    } = this.props

    switch (trigger) {
      case '#':
        if (permissions.canUseGrapesearch) {
          // Avoid browser opening in case of `#s` input.
          if (!showBrowser && query && query.length > 1) return
          onRequestAutocomplete({ search, filters })
          onShowSearchBrowser(search)
        }
        break
      case '@':
        if (channel.type === 'pm') return
        onSearchChannelsToMention(org, search, 12, channel.id)
        onShowUsersAndRoomsBrowser(search)
        break
      case ':':
        onShowEmojiSuggestBrowser(search)
        break
      case '…':
        if (showBrowser !== 'emoji') {
          onShowEmojiBrowser()
        }
        break
      default:
    }
  }

  onAbort = () => {
    const {
      showBrowser,
      onHideBrowser,
      targetMessage,
      onAbortEdit,
    } = this.props

    if (showBrowser) {
      onHideBrowser()
      this.focus()
    } else if (targetMessage) {
      onAbortEdit()
      this.saveDraftMessageToLocalStorage('')
      this.input.setTextContent('', { silent: true })
    }
  }

  onChange = () => {
    this.updateDraftOnEdit()
    this.startTypingThrottled()
    this.stopTypingDebounced()
  }

  getDraftMessages = () =>
    localStorage.draftMessages ? JSON.parse(localStorage.draftMessages) : {}

  getBrowserProps(browser) {
    const {
      showBrowser,
      channel,
      search,
      autocomplete,
      services,
      servicesStats,
      onRequestAutocompleteServices,
      onAddIntegration,
      channelsToMention,
    } = this.props

    switch (showBrowser) {
      case 'emoji': {
        return {
          browser,
          setTrigger: true,
        }
      }
      case 'emojiSuggest': {
        return {
          browser,
          setTrigger: true,
          maxSuggestions: 6,
          data: getEmojiSearchData(emoji, search),
        }
      }
      case 'user': {
        return {
          browser,
          setTrigger: true,
          maxSuggestions: 12,
          data: searchChannelsToMention(channelsToMention, channel),
        }
      }
      case 'search': {
        return {
          browser,
          setTrigger: true,
          data: autocomplete,
          onLoadServices: onRequestAutocompleteServices,
          onAddIntegration,
          services,
          servicesStats,
          isLoading:
            search !== '' && get(autocomplete, 'search.text') !== search,
        }
      }
      default:
        return null
    }
  }

  updateDraftOnEdit = debounce(() => {
    this.saveDraftMessageToLocalStorage(this.input.getTextContent())
  }, debouncingTime)

  saveDraftMessageToLocalStorage(content) {
    let { draftMessages = '{}' } = localStorage
    const {
      channel: { id },
    } = this.props

    draftMessages = JSON.parse(draftMessages)

    if (content) {
      draftMessages[id] = content
    } else {
      delete draftMessages[id]
    }

    localStorage.setItem('draftMessages', JSON.stringify(draftMessages))
  }

  startTypingThrottled = throttle(
    () => {
      const { channel, onSetTyping } = this.props
      if (channel) {
        onSetTyping({ channel, typing: true })
      }
    },
    typingThrottlingDelay,
    { trailing: false },
  )

  stopTypingDebounced = debounce(() => {
    const { channel, onSetTyping } = this.props
    if (channel) {
      onSetTyping({ channel, typing: false })
    }
  }, 5000)

  focus = () => {
    // TODO: grape-browser needs a better way to support this.
    this.setState({ focused: false }, () => {
      this.setState({ focused: true })
    })
  }

  removeFocus = () => {
    this.setState({ focused: false })
  }

  render() {
    const {
      classes,
      customEmojis,
      images,
      showBrowser,
      targetMessage,
      quoteMessage,
      isPostingLimited,
      onEditPreviousMessage,
      onHideBrowser,
      onRequestAutocompleteServicesStats,
      goTo,
      channel,
      conf,
      intl: { formatMessage },
    } = this.props
    let browserProps = {}
    if (showBrowser) {
      browserProps = this.getBrowserProps(showBrowser)
    }

    return (
      <GlobalEvent event="keydown" handler={this.onKeyDown}>
        <div
          className={cn(classes.wrapper, {
            [classes.wrapperDisabled]: isPostingLimited,
          })}
        >
          <div
            className={cn(classes.editMessage, {
              [classes.editMessageVisible]: targetMessage,
            })}
          >
            <FormattedMessage
              id="hitKeyToCancelEditing"
              defaultMessage="Hit {key} to cancel editing."
              values={{
                key: (
                  <span className={classes.editMessageButton}>
                    {formatMessage(messages.keyESC)}
                  </span>
                ),
              }}
            />
          </div>
          <GrapeBrowser
            isPostingLimited={isPostingLimited}
            targetMessage={targetMessage}
            quoteMessage={quoteMessage}
            locale={conf.user.languageCode}
            focused={this.state.focused}
            customEmojis={customEmojis}
            images={images}
            onAbort={this.onAbort}
            onComplete={this.onComplete}
            onEditPrevious={onEditPreviousMessage}
            onInsertItem={onHideBrowser}
            onSubmit={this.onSubmit}
            onDidMount={this.onGrapeBrowserRef}
            onChange={this.onChange}
            goTo={goTo}
            channel={channel}
            onLoadServicesStats={onRequestAutocompleteServicesStats}
            onBlur={this.removeFocus}
            {...browserProps}
          />
        </div>
      </GlobalEvent>
    )
  }
}

export default injectSheet(styles)(injectIntl(GrapeInput))
