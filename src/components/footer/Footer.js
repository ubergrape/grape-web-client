import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import Controls from './Controls'
import {styles} from './footerTheme'
import {Link as MarkdownTipsLink} from '../markdown-tips'
import {TypingNotification} from '../typing-notification'
import {GrapeInput} from '../grape-input'

@injectSheet(styles)
export default class Footer extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    showBrowser: PropTypes.oneOf([false, 'emoji', 'emojiSuggest', 'user', 'search']).isRequired,
    targetMessage: PropTypes.object,
    customEmojis: PropTypes.object,
    images: PropTypes.object.isRequired,
    rooms: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    search: PropTypes.string,
    autocomplete: PropTypes.object,
    services: PropTypes.array,
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
    onUploadFiles: PropTypes.func.isRequired,
    onRejectFiles: PropTypes.func.isRequired,
    onEditMessageSend: PropTypes.func.isRequired,
    onEditMessageAbort: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false,
    targetMessage: null,
    search: '',
    services: [],
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
      showBrowser,
      customEmojis,
      images,
      disabled,
      search,
      autocomplete,
      users,
      rooms,
      services,
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
      onSetTyping
    } = this.props
    return (
      <footer
        className={`${classes.footer} ${targetMessage ? classes.highlighted : ''}`}
        id="intro-stepOne"
        data-step="1"
        data-topic="grape input"
      >
        <TypingNotification
          channels={channels}
          channel={channel}
          cleanupTyping={onCleanupTyping}
        />
        <div className={classes.markdownTips}>
          <MarkdownTipsLink onClick={onShowMarkdownTips} />
        </div>
        <div className={classes.inputWithControls} ref={this.onRef}>
          <GrapeInput
            customEmojis={customEmojis}
            images={images}
            rooms={rooms}
            channel={channel}
            targetMessage={targetMessage}
            disabled={disabled}
            showBrowser={showBrowser}
            search={search}
            users={users}
            autocomplete={autocomplete}
            services={services}

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
            onSetTyping={onSetTyping}
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
