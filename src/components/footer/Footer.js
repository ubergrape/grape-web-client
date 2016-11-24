import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'
import {Link as MarkdownTipsLink} from '../markdown-tips'
import {TypingNotification} from '../typing-notification'

// FIXME rewrite legacy grape input.

@injectSheet(styles)
export default class Footer extends PureComponent {
  componentDidMount() {
    this.footer.appendChild(window.ui.grapeInput.el)
  }

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    showMarkdownTips: PropTypes.func.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    setUsers: PropTypes.func.isRequired,
    cleanupTyping: PropTypes.func.isRequired
  }

  onRef = (ref) => {
    this.footer = ref
  }

  render() {
    const {
      sheet: {classes},
      showMarkdownTips,
      channels,
      channel,
      setUsers,
      cleanupTyping
    } = this.props

    return (
      <footer
        className={classes.footer}
        ref={this.onRef}
        id="intro-stepOne"
        data-step="1"
        data-topic="grape input">
        <TypingNotification
          channels={channels}
          channel={channel}
          setUsers={setUsers}
          cleanupTyping={cleanupTyping} />
        <div className={classes.markdownTips}>
          <MarkdownTipsLink onClick={showMarkdownTips} />
        </div>
      </footer>
    )
  }
}
