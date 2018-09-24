import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Link as MarkdownTipsLink } from '../markdown-tips'
import Controls from './Controls'
import { styles } from './footerTheme'
import GrapeInput from './grape-input/GrapeInput'
import TypingNotification from './typing-notification/TypingNotification'

class Footer extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    isMemberOfAnyRooms: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    showBrowser: PropTypes.oneOf([
      false,
      'emoji',
      'emojiSuggest',
      'user',
      'search',
    ]).isRequired,
    org: PropTypes.object,
    conf: PropTypes.object,
    targetMessage: PropTypes.object,
    quoteMessage: PropTypes.object,
    customEmojis: PropTypes.object,
    images: PropTypes.object.isRequired,
    search: PropTypes.string,
    autocomplete: PropTypes.object,
    services: PropTypes.array,
    servicesStats: PropTypes.object,
    channelsToMention: PropTypes.array,
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
    onOpenFileDialog: PropTypes.func,
    onEditMessageSend: PropTypes.func.isRequired,
    onEditMessageAbort: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    onSearchChannelsToMention: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
  }

  static defaultProps = {
    disabled: false,
    org: {},
    conf: {},
    targetMessage: undefined,
    quoteMessage: undefined,
    search: '',
    services: [],
    servicesStats: {},
    channelsToMention: [],
    customEmojis: {},
    autocomplete: {},
    onOpenFileDialog: undefined,
  }

  onRef = ref => {
    this.inputWithControls = ref
  }

  render() {
    const {
      classes,
      channels,
      channel,
      org,
      conf,
      targetMessage,
      quoteMessage,
      showBrowser,
      customEmojis,
      images,
      disabled,
      isMemberOfAnyRooms,
      search,
      autocomplete,
      services,
      servicesStats,
      channelsToMention,
      onCleanupTyping,
      onShowMarkdownTips,
      onUploadFiles,
      onShowEmojiBrowser,
      onShowEmojiSuggestBrowser,
      onShowUsersAndRoomsBrowser,
      onShowSearchBrowser,
      onRejectFiles,
      onOpenFileDialog,
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
      onAddIntegration,
      onSearchChannelsToMention,
      goTo,
    } = this.props

    return (
      <footer
        className={`${classes.footer} ${
          targetMessage ? classes.highlighted : ''
        }`}
      >
        {isMemberOfAnyRooms && (
          <div>
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
                channel={channel}
                org={org}
                conf={conf}
                targetMessage={targetMessage}
                quoteMessage={quoteMessage}
                disabled={disabled}
                showBrowser={showBrowser}
                search={search}
                autocomplete={autocomplete}
                services={services}
                servicesStats={servicesStats}
                channelsToMention={channelsToMention}
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
                onRequestAutocompleteServicesStats={
                  onRequestAutocompleteServicesStats
                }
                onSetTyping={onSetTyping}
                onAddIntegration={onAddIntegration}
                onSearchChannelsToMention={onSearchChannelsToMention}
                goTo={goTo}
              />
              <Controls
                disabled={disabled}
                showBrowser={showBrowser}
                onUpload={onUploadFiles}
                onShowEmojiBrowser={onShowEmojiBrowser}
                onShowSearchBrowser={onShowSearchBrowser}
                onHideBrowser={onHideBrowser}
                onRejectFiles={onRejectFiles}
                onOpenFileDialog={onOpenFileDialog}
              />
            </div>
          </div>
        )}
      </footer>
    )
  }
}

export default injectSheet(styles)(Footer)
