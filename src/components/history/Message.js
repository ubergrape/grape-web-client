import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'
import useTheme from '../theme/useTheme2'

import Avatar from '../avatar/Avatar'
import GrapeDown from '../grape-down/GrapeDown'
import Header from '../message-parts/Header'
import Bubble from '../message-parts/Bubble'
import styles from './messageStyles'
import ownBubbleStyles from './ownBubbleStyles'
import othersBubbleStyles from './othersBubbleStyles'

const OwnBubble = useTheme(Bubble, {styles: ownBubbleStyles})
const OthersBubble = useTheme(Bubble, {styles: othersBubbleStyles})

@useSheet(styles)
export default class Message extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    children: PropTypes.node.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isPending: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    author: PropTypes.string,
    avatar: PropTypes.string
  }

  static defaultProps = {
    isPending: false,
    hasBubbleArrow: true,
    isOwn: false
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {
      sheet, author, time, avatar, children, hasBubbleArrow, isPending, isOwn
    } = this.props
    const {classes} = sheet
    const ThemedBubble = isOwn ? OwnBubble : OthersBubble

    return (
      <section className={classes.message}>
        {author && <Header date={time} author={author} className={classes.header} />}
        <div className={`${classes.body} ${!avatar && classes.avatarPlaceholder}`}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <ThemedBubble className={classes.bubble} hasArrow={hasBubbleArrow}>
            <div className={isPending ? classes.pending : ''}>
              <GrapeDown text={children} />
            </div>
          </ThemedBubble>
        </div>
      </section>
    )
  }
}
