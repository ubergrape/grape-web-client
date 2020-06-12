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
    isPostingLimited: PropTypes.bool,
    isMemberOfAnyRooms: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    typingChannels: PropTypes.object.isRequired,
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
    permissions: PropTypes.object,
  }

  static defaultProps = {
    isPostingLimited: false,
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
    permissions: {},
  }

  onRef = ref => {
    this.inputWithControls = ref
  }

  render() {
    const {
      classes,
      typingChannels,
      channel,
      org,
      conf,
      targetMessage,
      quoteMessage,
      showBrowser,
      customEmojis,
      images,
      isPostingLimited,
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
      permissions,
    } = this.props

    return (
      <footer
        className={`${classes.footer} ${
          targetMessage ? classes.highlighted : ''
        }`}
      >
        {isMemberOfAnyRooms && Object.keys(this.props.channel).length !== 0 && (
          <div>
            <div className={classes.above}>
              <div className={classes.typingNotificationContainer}>
                <TypingNotification
                  channels={typingChannels}
                  channel={channel}
                  cleanupTyping={onCleanupTyping}
                  className={classes.typingNotification}
                />
              </div>
              {!isPostingLimited && (
                <MarkdownTipsLink
                  onClick={onShowMarkdownTips}
                  className={classes.markdownTipsLink}
                />
              )}
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
                isPostingLimited={isPostingLimited}
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
                permissions={permissions}
              />
              <Controls
                isPostingLimited={isPostingLimited}
                showBrowser={showBrowser}
                onUpload={onUploadFiles}
                onShowEmojiBrowser={onShowEmojiBrowser}
                onShowSearchBrowser={onShowSearchBrowser}
                onHideBrowser={onHideBrowser}
                onRejectFiles={onRejectFiles}
                onOpenFileDialog={onOpenFileDialog}
                permissions={permissions}
              />
            </div>
          </div>
        )}
      </footer>
    )
  }
}

export default injectSheet(styles)(Footer)
