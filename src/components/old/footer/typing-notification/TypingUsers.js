import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import { random } from 'lodash'
import { small } from 'grape-theme/dist/fonts'
import { grayLight } from 'grape-theme/dist/base-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'

const dotAnimation = `dot-${random(1000000)}`

const getText = (users, max) => {
  const names = users.map(user => user.displayName)

  if (names.length === 1) {
    return (
      <FormattedMessage
        id="userIsTyping"
        values={{ user: names[0] }}
        defaultMessage="{user} is typing"
      />
    )
  }

  if (names.length <= max) {
    const last = names.pop()
    return (
      <FormattedMessage
        id="usersAndUserAreTyping"
        values={{
          users: names.join(', '),
          user: last,
        }}
        defaultMessage="{users} and {user} are typing"
      />
    )
  }

  return (
    <FormattedMessage
      id="usersAreTyping"
      values={{
        users: names.slice(0, max).join(', '),
        othersAmount: names.length - max,
      }}
      defaultMessage="{users} and {othersAmount} {othersAmount, plural, one {other} other {others}} are typing"
    />
  )
}

/**
 * Render users list.
 *
 * - Val is typing.
 * - Val and Oleg are typing.
 * - Val, Oleg and Leo are typing.
 * - Val, Oleg, Leo and 3 others are typing.
 */
class TypingUsers extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    users: PropTypes.array,
    max: PropTypes.number,
  }

  static defaultProps = {
    max: 3,
    className: null,
    users: [],
  }

  render() {
    const { classes, max, users } = this.props

    return <div className={classes.typingUsers}>{getText(users, max)}</div>
  }
}

export default injectSheet({
  typingUsers: {
    extend: [small, ellipsis],
    color: grayLight,
    '&:after': {
      content: '"…"',
      overflow: 'hidden',
      display: 'inline-block',
      verticalAlign: 'bottom',
      width: 0,
      animation: `${dotAnimation} steps(4, end) 1s infinite`,
      color: 'inherit',
    },
  },
  [`@keyframes ${dotAnimation}`]: {
    to: {
      width: '1em',
    },
  },
})(TypingUsers)
