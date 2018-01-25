import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {injectIntl, FormattedMessage, defineMessages} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import GlobalEvent from 'grape-web/lib/components/global-event'
import {GrapeBrowser} from 'grape-browser'
import * as emoji from 'grape-browser/lib/components/emoji'
import debounce from 'lodash/function/debounce'
import throttle from 'lodash/function/throttle'
import get from 'lodash/object/get'
import cn from 'classnames'

import {
  getEmojiSearchData,
  getUserSearchData,
  getRoomsSearchData,
  getImageAttachments,
  formatQuote
} from './utils'

const inputNodes = ['INPUT', 'TEXT', 'TEXTAREA', 'SELECT']

const messages = defineMessages({
  placeholder: {
    id: 'editMessagePlaceholder',
    defaultMessage: 'Enter a message …'
  },
  keyESC: {
    id: 'keyESC',
    defaultMessage: 'ESC'
  }
})

const styles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    position: 'relative'
  },
  wrapperDisabled: {
    pointerEvents: 'none',
    filter: 'grayscale(100%)',
    opacity: 0.4
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
    fontSize: '0.8em'
  },
  editMessageVisible: {
    opacity: 1,
    top: -22
  },
  editMessageButton: {
    borderRadius: 3,
    border: '1px solid #CCCCCC',
    padding: [1, 3],
    margin: [0, 2],
    color: '#666666',
    background: '#FBFBFB',
    fontSize: '100%'
  }
}

@injectSheet(styles)
@injectIntl
export default class GrapeInput extends PureComponent {
  static propTypes = {
    customEmojis: PropTypes.object,
    images: PropTypes.object.isRequired,
    org: PropTypes.object,
    targetMessage: PropTypes.object,
    quoteMessage: PropTypes.object,
    channel: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    showBrowser: PropTypes.oneOf([false, 'emoji', 'emojiSuggest', 'user', 'search']).isRequired,
    search: PropTypes.string,
    autocomplete: PropTypes.object,
    services: PropTypes.array,
    servicesStats: PropTypes.object,
    usersToMention: PropTypes.array,
    channelsToMention: PropTypes.array,
    onCreateMessage: PropTypes.func.isRequired,
    onUpdateMessage: PropTypes.func.isRequired,
    onSetTyping: PropTypes.func.isRequired,
    onAbortEdit: PropTypes.func.isRequired,
    onHideBrowser: PropTypes.func.isRequired,
    onSetUnsentMessage: PropTypes.func.isRequired,
    onEditPreviousMessage: PropTypes.func.isRequired,
    onShowEmojiBrowser: PropTypes.func.isRequired,
    onShowEmojiSuggestBrowser: PropTypes.func.isRequired,
    onShowUsersAndRoomsBrowser: PropTypes.func.isRequired,
    onShowSearchBrowser: PropTypes.func.isRequired,
    onRequestAutocomplete: PropTypes.func.isRequired,
    onRequestAutocompleteServices: PropTypes.func.isRequired,
    onRequestAutocompleteServicesStats: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    onSearchUsersToMention: PropTypes.func.isRequired,
    onSearchChannelsToMention: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false,
    org: {},
    targetMessage: null,
    quoteMessage: null,
    search: '',
    services: [],
    servicesStats: {},
    usersToMention: [],
    channelsToMention: [],
    customEmojis: {},
    autocomplete: {}
  }

  constructor(props) {
    super(props)
    this.previous = {}
    this.unsent = {}
    this.input = null
    this.state = {
      focused: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      channel: curChannel,
      targetMessage: currTargetMessage,
      quoteMessage: currQuoteMessage,
      intl
    } = this.props

    const {
      channel: nextChannel,
      targetMessage: nextTargetMessage,
      quoteMessage: nextQuoteMessage
    } = nextProps

    if (curChannel.id !== nextChannel.id) {
      this.onSelectChannel(curChannel, nextChannel)
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
        message: nextQuoteMessage
      })
      this.input.setTextContent(quote, {silent: true, caretPosition: 'start'})
    }
  }

  /**
   * Focus grape input to make user type in it when he started to type somewhere
   * outside, but not in some other input cabable field.
   */
  onKeyDown = (e) => {
    // For e.g. when trying to copy text from history.
    if (e.altKey || e.ctrlKey || e.metaKey) return
    // Skip every combinination with Shift that doesn't produce a single letter.
    if (e.shiftKey && e.key.length > 1) return
    if (inputNodes.indexOf(e.target.nodeName) >= 0) return
    if (this.disabled) return
    this.focus()
  }

  onEditMessage(msg) {
    this.input.setTextContent(msg.text, {silent: true})
  }

  onSelectChannel(prev, next) {
    const {targetMessage, onSetUnsentMessage} = this.props
    if (prev.id && !targetMessage) {
      onSetUnsentMessage(prev.id, this.input.getTextContent())
    }
    this.input.setTextContent(next.unsent || '', {silent: true})
    this.focus()
  }

  onGrapeBrowserRef = (ref) => {
    this.input = ref
  }

  onSubmit = (data) => {
    const {
      targetMessage, onCreateMessage, onUpdateMessage,
      channel, onSetUnsentMessage, onHideBrowser
    } = this.props

    let sendText = true

    if (targetMessage) {
      onUpdateMessage({
        channelId: channel.id,
        messageId: targetMessage.id,
        text: data.content
      })
    } else {
      const attachments = getImageAttachments(data.objects)
      // If a message text contains only media objects we will render a preview
      // in the history for, there is no need to send this objects as text.
      if (data.objectsOnly && attachments.length === data.objects.length) {
        sendText = false
      }
      // Separate message to make it separately editable and removable.
      if (sendText) onCreateMessage({channelId: channel.id, text: data.content})
      if (attachments.length) {
        onCreateMessage({channelId: channel.id, attachments})
      }
    }
    onSetUnsentMessage(channel.id, '')
    onHideBrowser()
  }

  onComplete = (data) => {
    const {filters, search, query, trigger} = data
    const {
      org, showBrowser, onShowSearchBrowser, onShowUsersAndRoomsBrowser,
      onShowEmojiSuggestBrowser, onShowEmojiBrowser, onRequestAutocomplete,
      onSearchUsersToMention, onSearchChannelsToMention
    } = this.props

    switch (trigger) {
      case '#':
        // Avoid browser opening in case of `#s` input.
        if (!showBrowser && query.length > 1) return
        if (search || (filters && filters.length)) {
          onRequestAutocomplete({search, filters})
        }
        onShowSearchBrowser(search)
        break
      case '@':
        onSearchChannelsToMention(org, search, 10)
        onSearchUsersToMention(org, search, 10)
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
      showBrowser, onHideBrowser, targetMessage,
      onAbortEdit, channel, onSetUnsentMessage
    } = this.props

    if (showBrowser) {
      onHideBrowser()
      this.focus()
    } else if (targetMessage) {
      onAbortEdit()
      this.input.setTextContent('', {silent: true})
      onSetUnsentMessage(channel.id, '')
    }
  }

  onChange = () => {
    this.startTypingThrottled()
    this.stopTypingDebounced()
  }

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
      usersToMention,
      channelsToMention
    } = this.props

    switch (showBrowser) {
      case 'emoji': {
        return {
          browser,
          setTrigger: true
        }
      }
      case 'emojiSuggest': {
        return {
          browser,
          setTrigger: true,
          maxSuggestions: 6,
          data: getEmojiSearchData(emoji, search)
        }
      }
      case 'user': {
        return {
          browser,
          setTrigger: true,
          maxSuggestions: 12,
          data: [
            ...getUserSearchData(usersToMention, channel.users, search),
            ...getRoomsSearchData(channelsToMention, channel, search)
          ]
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
          isLoading: search !== '' && get(autocomplete, 'search.text') !== search
        }
      }
      default:
        return null
    }
  }

  startTypingThrottled = (
    throttle(() => {
      const {channel, onSetTyping} = this.props
      if (channel) {
        onSetTyping({channel, typing: true})
      }
    },
    5000, {trailing: false})
  )

  stopTypingDebounced = (
    debounce(() => {
      const {channel, onSetTyping} = this.props
      if (channel) {
        onSetTyping({channel, typing: false})
      }
    },
    5000)
  )

  focus() {
    // TODO: grape-browser needs a better way to support this.
    this.setState({focused: false}, () => {
      this.setState({focused: true})
    })
  }

  render() {
    const {
      classes, customEmojis, images, showBrowser, targetMessage,
      disabled, onEditPreviousMessage, onHideBrowser,
      onRequestAutocompleteServicesStats,
      intl: {formatMessage}
    } = this.props
    let browserProps = {}
    if (showBrowser) {
      browserProps = this.getBrowserProps(showBrowser)
    }
    return (
      <GlobalEvent event="keydown" handler={this.onKeyDown}>
        <div className={cn(classes.wrapper, {[classes.wrapperDisabled]: disabled})}>
          <div className={cn(classes.editMessage, {[classes.editMessageVisible]: targetMessage})}>
            <FormattedMessage
              id="hitKeyToCancelEditing"
              defaultMessage="Hit {key} to cancel editing."
              values={{
                key: (
                  <span className={classes.editMessageButton}>
                    {formatMessage(messages.keyESC)}
                  </span>
                )
              }}
            />
          </div>
          <GrapeBrowser
            placeholder={formatMessage(messages.placeholder)}
            disabled={disabled}
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
            onLoadServicesStats={onRequestAutocompleteServicesStats}
            {...browserProps}
          />
        </div>
      </GlobalEvent>
    )
  }
}
