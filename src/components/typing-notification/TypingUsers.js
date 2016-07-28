import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

/**
 * Render users list.
 *
 * - Val is typing.
 * - Val and Oleg are typing.
 * - Val, Oleg and Leo are typing.
 * - Val, Oleg, Leo and 3 others are typing.
 */
@useSheet(style)
export default class TypingUsers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    max: PropTypes.number
  }

  static defaultProps = {
    max: 3
  }

  render() {
    const {classes} = this.props.sheet
    const {max, users} = this.props

    if (!users.length) return null

    const names = users.map(user => user.name)
    let text

    if (names.length === 1) {
      text = (
        <FormattedMessage
          id="userIsTyping"
          values={{user: names[0]}}
          defaultMessage="{user} is typing"/>
      )
    } else if (names.length <= max) {
      const last = names.pop()
      text = (
        <FormattedMessage
          id="userAndUsersAreTyping"
          values={{
            users: names.join(', '),
            user: last
          }}
          defaultMessage="{users} and {user} are typing"/>
      )
    } else {
      text = (
        <FormattedMessage
          id="UsersAreTyping"
          values={{
            users: names.slice(0, max).join(', '),
            othersAmount: names.length - max
          }}
          defaultMessage="{users} and {othersAmount} {othersAmount, plural, one {other} other {others}} are typing"/>
      )
    }

    return (
      <div className={classes.notification}>
        {text}
      </div>
    )
  }
}
