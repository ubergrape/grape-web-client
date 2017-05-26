import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'

import {styles} from './authorTheme'

@injectSheet(styles)
export default class Author extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    author: PropTypes.string
  }

  static defaultProps = {
    onClick: null,
    className: '',
    author: null
  }

  render() {
    const {author, onClick, sheet, className} = this.props
    const {classes} = sheet
    return (
      <span
        onClick={onClick}
        className={`${classes.author} ${className}`}
      >
        {author || <FormattedMessage id="deletedUser" defaultMessage="Deleted user" />}
      </span>
    )
  }
}
