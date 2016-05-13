import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'

import Avatar from '../avatar/Avatar'
import GrapeDown from '../grape-down/GrapeDown'
import Header from '../message-parts/Header'
import Bubble from '../message-parts/Bubble'
import styles from './messageStyles'

@useSheet(styles)
export default class Message extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    children: PropTypes.node.isRequired,
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    bubbleArrow: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired
  }

  static defaultProps = {
    pending: false,
    bubbleArrow: false
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {sheet, author, time, avatar, children, bubbleArrow, pending} = this.props
    const {classes} = sheet
    return (
      <section className={classes.message}>
        {author && <Header date={time} author={author} className={classes.header} />}
        <div className={`${classes.body} ${!avatar && classes.avatarPlaceholder}`}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <Bubble className={classes.bubble} arrow={bubbleArrow}>
            <div className={pending ? classes.pending : ''}>
              <GrapeDown text={children} />
            </div>
          </Bubble>
        </div>
      </section>
    )
  }
}
