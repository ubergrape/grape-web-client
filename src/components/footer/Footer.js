import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'
import {TypingNotificationProvider} from '../../containers/typing-notification'

// FIXME rewrite legacy grape input.

@injectSheet(styles)
export default class Footer extends PureComponent {
  componentDidMount() {
    this.footer.appendChild(window.ui.grapeInput.el)
  }

  onRef = (ref) => {
    this.footer = ref
  }

  render() {
    const {sheet: {classes}} = this.props
    return (
      <footer
        className={classes.footer}
        ref={this.onRef}
        id="intro-stepOne"
        data-step="1"
        data-topic="grape input">
        <TypingNotificationProvider />
      </footer>
    )
  }
}
