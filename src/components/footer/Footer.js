import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import Controls from './Controls'
import {styles} from './footerTheme'
import {Link as MarkdownTipsLink} from '../markdown-tips'
import {TypingNotification} from '../typing-notification'

// FIXME rewrite legacy grape input.

@injectSheet(styles)
export default class Footer extends PureComponent {
  componentDidMount() {
    this.inputWithControls.insertBefore(window.ui.grapeInput.el, this.inputWithControls.firstChild)
  }

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onShowMarkdownTips: PropTypes.func.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    cleanupTyping: PropTypes.func.isRequired
  }

  onRef = (ref) => {
    this.inputWithControls = ref
  }

  render() {
    const {
      sheet: {classes},
      channels,
      channel,
      cleanupTyping,
      onShowMarkdownTips,
      onUpload,
      onShowEmojiBrowser,
      onShowGrapeBrowser,
      onRejectFiles
    } = this.props

    return (
      <footer
        className={classes.footer}
        id="intro-stepOne"
        data-step="1"
        data-topic="grape input">
        <TypingNotification
          channels={channels}
          channel={channel}
          cleanupTyping={cleanupTyping} />
        <div className={classes.markdownTips}>
          <MarkdownTipsLink onClick={onShowMarkdownTips} />
        </div>
        <div className={classes.inputWithControls} ref={this.onRef}>
          <Controls
            onUpload={onUpload}
            onShowEmojiBrowser={onShowEmojiBrowser}
            onShowGrapeBrowser={onShowGrapeBrowser}
            onRejectFiles={onRejectFiles} />
        </div>
      </footer>
    )
  }
}
