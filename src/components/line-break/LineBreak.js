import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { normal } from 'grape-theme/dist/fonts'
import { prefix } from 'css-vendor'

const styles = {
  lineBreak: {
    display: 'block',
    width: '100%',
    height: normal.fontSize / 2,
    cursor: 'text',
    userSelect: 'none',
  },
  // This class hides the content, but the text will still be visible in the clipboard.
  copyOnly: {
    display: 'inline-block',
    verticalAlign: 'baseline',
    width: '1px',
    height: 0,
    fontSize: 0,
    color: 'transparent',
    // Firefox needs `user-select: 'all'` otherwise
    // newlines are not copied to clipboard.
    userSelect: prefix.js === 'Moz' ? 'all' : 'none',
  },
}

@injectSheet(styles)
export default class LineBreak extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }
  render() {
    const { classes } = this.props
    return (
      <span className={classes.lineBreak} role="presentation">
        <span className={classes.copyOnly}>
          <br />
        </span>
      </span>
    )
  }
}
