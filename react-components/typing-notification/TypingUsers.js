import React, {Component} from 'react'

import style from './style'
import {useSheet} from '../jss'

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
      text = `${names[0]} is typing`
    }
    else if (names.length <= max) {
      const last = names.pop()
      text = `${names.join(', ')} and ${last} are typing`
    }
    else {
      text = `${names.slice(0, max).join(', ')} and ${names.length - max} others are typing`
    }

    return (
      <div className={classes.notification}>
        {text}
      </div>
    )
  }
}
