import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

const dateFormat = 'h:mm a'

@useSheet(style)
export default class Message extends Component {
  static defaultProps = {
    author: undefined,
    time: undefined,
    content: undefined,
    avatar: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {classes} = this.props.sheet
    return (
      <section className={classes.message}>
        <header className={classes.header}>
          <span className={classes.author}>{this.props.author}</span>
          <span className={classes.date}>{tz(this.props.time).format(dateFormat)}</span>
        </header>
        <div className={classes.body}>
          <div className={classes.leftColumn}>
            <div
              style={{backgroundImage: `url(${this.props.avatar})`}}
              className={classes.avatar}></div>
          </div>
          <div className={classes.rightColumn}>
            <div className={classes.content}>{this.props.content}</div>
          </div>
        </div>
      </section>
    )
  }
}
