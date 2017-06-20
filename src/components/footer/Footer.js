import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {Link as MarkdownTipsLink} from '../markdown-tips'
import Controls from './Controls'
import {styles} from './footerTheme'
import GrapeInput from './grape-input/GrapeInput'
import TypingNotification from './typing-notification/TypingNotification'

@injectSheet(styles)
export default class Footer extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    showBrowser: PropTypes.oneOf([false, 'emoji', 'emojiSuggest', 'user', 'search']).isRequired,
    targetMessage: PropTypes.object,
    quoteMessage: PropTypes.object,
    customEmojis: PropTypes.object,
    images: PropTypes.object.isRequired,
    rooms: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    search: PropTypes.string,
    autocomplete: PropTypes.object,
    services: PropTypes.array,
    servicesStats: PropTypes.object,
    onShowMarkdownTips: PropTypes.func.isRequired,
    onCleanupTyping: PropTypes.func.isRequired,
    onHideBrowser: PropTypes.func.isRequired,
    onCreateMessage: PropTypes.func.isRequired,
    onSetTyping: PropTypes.func.isRequired,
    onSetUnsentMessage: PropTypes.func.isRequired,
    onEditPreviousMessage: PropTypes.func.isRequired,
    onShowEmojiBrowser: PropTypes.func.isRequired,
    onShowEmojiSuggestBrowser: PropTypes.func.isRequired,
    onShowUsersAndRoomsBrowser: PropTypes.func.isRequired,
    onShowSearchBrowser: PropTypes.func.isRequired,
    onRequestAutocomplete: PropTypes.func.isRequired,
    onRequestAutocompleteServices: PropTypes.func.isRequired,
    onRequestAutocompleteServicesStats: PropTypes.func.isRequired,
    onUploadFiles: PropTypes.func.isRequired,
    onRejectFiles: PropTypes.func.isRequired,
    onEditMessageSend: PropTypes.func.isRequired,
    onEditMessageAbort: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false,
    targetMessage: null,
    quoteMessage: null,
    search: '',
    services: [],
    servicesStats: {},
    customEmojis: {},
    autocomplete: {}
  }

  onRef = (ref) => {
    this.inputWithControls = ref
  }

  render() {
    const {
      classes,
      channels,
      channel,
      targetMessage,
      quoteMessage,
      showBrowser,
      customEmojis,
      images,
      disabled,
      search,
      autocomplete,
      users,
      rooms,
      services,
      servicesStats,
      onCleanupTyping,
      onShowMarkdownTips,
      onUploadFiles,
      onShowEmojiBrowser,
      onShowEmojiSuggestBrowser,
      onShowUsersAndRoomsBrowser,
      onShowSearchBrowser,
      onRejectFiles,
      onHideBrowser,
      onCreateMessage,
      onSetUnsentMessage,
      onEditMessageSend,
      onEditMessageAbort,
      onEditPreviousMessage,
      onRequestAutocomplete,
      onRequestAutocompleteServices,
      onRequestAutocompleteServicesStats,
      onSetTyping,
      onAddIntegration
    } = this.props
    return (
      <footer
        className={`${classes.footer} ${targetMessage ? classes.highlighted : ''}`}
        id="intro-stepOne"
        data-step="1"
        data-topic="grape input"
      >
        <div className={classes.above}>
          <div className={classes.typingNotificationContainer}>
            <TypingNotification
              channels={channels}
              channel={channel}
              cleanupTyping={onCleanupTyping}
              className={classes.typingNotification}
            />
          </div>
          <MarkdownTipsLink
            onClick={onShowMarkdownTips}
            className={classes.markdownTipsLink}
          />
        </div>
        <div className={classes.inputWithControls} ref={this.onRef}>
          <GrapeInput
            customEmojis={customEmojis}
            images={images}
            rooms={rooms}
            channel={channel}
            targetMessage={targetMessage}
            quoteMessage={quoteMessage}
            disabled={disabled}
            showBrowser={showBrowser}
            search={search}
            users={users}
            autocomplete={autocomplete}
            services={services}
            servicesStats={servicesStats}
            onShowEmojiBrowser={onShowEmojiBrowser}
            onShowEmojiSuggestBrowser={onShowEmojiSuggestBrowser}
            onShowUsersAndRoomsBrowser={onShowUsersAndRoomsBrowser}
            onShowSearchBrowser={onShowSearchBrowser}
            onHideBrowser={onHideBrowser}
            onCreateMessage={onCreateMessage}
            onUpdateMessage={onEditMessageSend}
            onAbortEdit={onEditMessageAbort}
            onSetUnsentMessage={onSetUnsentMessage}
            onEditPreviousMessage={onEditPreviousMessage}
            onRequestAutocomplete={onRequestAutocomplete}
            onRequestAutocompleteServices={onRequestAutocompleteServices}
            onRequestAutocompleteServicesStats={onRequestAutocompleteServicesStats}
            onSetTyping={onSetTyping}
            onAddIntegration={onAddIntegration}
          />
          <Controls
            disabled={disabled}
            showBrowser={showBrowser}
            onUpload={onUploadFiles}
            onShowEmojiBrowser={onShowEmojiBrowser}
            onShowSearchBrowser={onShowSearchBrowser}
            onHideBrowser={onHideBrowser}
            onRejectFiles={onRejectFiles}
          />
        </div>
      </footer>
    )
  }
}
