import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import bindAll from 'lodash/function/bindAll'
import copy from 'copy-to-clipboard'

import useTheme from '../theme/useTheme'
import Avatar from '../avatar/Avatar'
import GrapeDown from '../grape-down/GrapeDown'
import Header from '../message-parts/Header'
import Bubble from '../message-parts/Bubble'
import Menu from '../message-parts/Menu'
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
    userTime: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isPending: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    author: PropTypes.string,
    avatar: PropTypes.string
  }

  static defaultProps = {
    isPending: false,
    hasBubbleArrow: true,
    isOwn: false,
    onEdit: noop
  }

  constructor(props) {
    super(props)
    this.state = {isMenuOpened: false}
    bindAll(this, 'onMouseEnter', 'onMouseLeave', 'onCopyLink')
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onMouseEnter() {
    this.setState({isMenuOpened: true})
  }

  onMouseLeave() {
    this.setState({isMenuOpened: false})
  }

  onCopyLink() {
    copy(this.props.link)
  }

  renderMenu() {
    if (!this.state.isMenuOpened) return null

    return (
      <Menu
        onEdit={this.props.onEdit}
        onCopyLink={this.onCopyLink}
        onRemove={this.props.onRemove} />
    )
  }

  render() {
    const {
      sheet, author, time, userTime, avatar, children, hasBubbleArrow,
      isPending, isOwn
    } = this.props
    const {classes} = sheet
    const ThemedBubble = isOwn ? OwnBubble : OthersBubble
    return (
      <div className={classes.message}>
        {author &&
          <Header
            time={time}
            userTime={userTime}
            author={author}
            className={classes.header} />
        }
        <div
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          className={`${classes.body} ${avatar ? '' : classes.avatarPlaceholder}`}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <ThemedBubble className={classes.bubble} hasArrow={hasBubbleArrow}>
            <div className={isPending ? classes.pending : ''}>
              <GrapeDown text={children} />
            </div>
          </ThemedBubble>
          {this.renderMenu()}
        </div>
      </div>
    )
  }
}
