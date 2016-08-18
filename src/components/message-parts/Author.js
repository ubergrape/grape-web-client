import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import noop from 'lodash/utility/noop'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './authorTheme'

@useSheet(styles)
export default class Author extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
