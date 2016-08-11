import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './authorTheme'

@useSheet(styles)
export default class Author extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    author: PropTypes.string,
    onClick: PropTypes.func
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {author, sheet, onClick} = this.props
    const {classes} = sheet
    return (
      <span className={classes.author} onClick={onClick}>
        {author || <FormattedMessage id="deletedUser" defaultMessage="Deleted user" />}
      </span>
    )
  }
}
