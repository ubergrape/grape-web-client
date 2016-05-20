import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'

import Avatar from '../../avatar/Avatar'
import GrapeDown from '../../grape-down/GrapeDown'
import Header from '../../message-parts/Header'
import OthersBubble from './OthersBubble'
import styles from './activityMessageStyles'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#activites
@useSheet(styles)
export default class ActivityMessage extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    container: PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
    children: '',
    title: ''
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {
      sheet, author, time, avatar, title, children, container
    } = this.props
    const {classes} = sheet
    return (
      <div className={classes.message}>
        <Header
          time={time}
          author={author}
          className={classes.header} />

        <div className={`${classes.body} ${avatar ? '' : classes.avatarPlaceholder}`}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <OthersBubble className={classes.bubble}>
            <a
              href={container.url}
              target="_blank"
              className={classes.container}>
              {container.name}
            </a>
            <GrapeDown text={title} />
            <GrapeDown text={children} />
          </OthersBubble>
        </div>
      </div>
    )
  }
}
