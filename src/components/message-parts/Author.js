import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import noop from 'lodash/utility/noop'

import {styles} from './authorTheme'

@useSheet(styles)
export default class Author extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    author: PropTypes.string
  }

  static defaultProps = {
    onClick: noop
  }

  render() {
    const {author, onClick, sheet} = this.props
    return (
      <span
        onClick={onClick}
        className={sheet.classes.author}>
        {author || <FormattedMessage id="deletedUser" defaultMessage="Deleted user" />}
      </span>
    )
  }
}
