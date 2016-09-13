import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'

import Avatar from '../avatar/Avatar'
import Header from '../message-parts/Header'
import Bubble from '../message-parts/Bubble'
import styles from './messageStyles'

@useSheet(styles)
export default class Message extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    avatar: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {sheet: {classes}, author, time, avatar, children} = this.props

    return (
      <section className={classes.message}>
        <Header time={time} author={author.name} className={classes.header} />
        <div className={classes.body}>
          <Avatar src={avatar} className={classes.leftColumn}/>
          <Bubble className={classes.rightColumn} theme={{classes}}>
            {children}
          </Bubble>
        </div>
      </section>
    )
  }
}
