import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'

import {styles} from './linkTheme'

@injectSheet(styles)
export default class Link extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {sheet: {classes}, onClick} = this.props
    const Button = (
      <button className={classes.button} onClick={onClick}>
        markdown
      </button>
    )
    return (
      <span>
        <FormattedMessage
          id="markdownTipsLinkMessage"
          defaultMessage="You can also use {markdown}"
          values={{markdown: Button}} />
      </span>
    )
  }
}
