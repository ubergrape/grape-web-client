import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import noop from 'lodash/utility/noop'

import {styles} from './authorTheme'

@injectSheet(styles)
export default class Author extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    author: PropTypes.string
  }

  static defaultProps = {
    onClick: noop,
    className: ''
  }

  render() {
    const {author, onClick, sheet, className} = this.props
    const {classes} = sheet
    return (
      <span
        onClick={onClick}
        className={`${classes.author} ${className}`}>
        {author || <FormattedMessage id="deletedUser" defaultMessage="Deleted user" />}
      </span>
    )
  }
}
