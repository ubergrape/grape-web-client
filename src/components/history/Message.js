import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'

import Avatar from '../avatar/Avatar'
import Header from '../messages/Header'
import Bubble from '../messages/Bubble'
import styles from './messageStyles'

@useSheet(styles)
export default class Message extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    author: PropTypes.string,
    avatar: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {sheet, author, time, avatar, children} = this.props
    const {classes} = sheet
    return (
      <section className={classes.message}>
        <Header date={time} author={author} className={classes.header} />
        <div className={classes.body}>
          <Avatar src={avatar} className={classes.leftColumn}/>
          <Bubble className={classes.rightColumn}>
            {children}
          </Bubble>
        </div>
      </section>
    )
  }
}
