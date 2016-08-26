import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {useSheet} from 'grape-web/lib/jss'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import {MateBubble} from './Bubble'
import DuplicatesBadge from './DuplicatesBadge'
import {styles} from './activityMessageTheme'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#activites
@useSheet(styles)
export default class ActivityMessage extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    duplicates: PropTypes.number.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    avatar: PropTypes.string,
    container: PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }),
    user: PropTypes.object
  }

  static defaultProps = {
    children: '',
    title: ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      sheet, user, author, time, avatar, container, title, children, duplicates
    } = this.props
    const {classes} = sheet

    return (
      <div className={classes.message}>
        {author &&
          <Header
            time={time}
            author={author.name}
            className={classes.header} />
          }
        <div className={`${classes.body} ${avatar ? '' : classes.avatarPlaceholder}`}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <div className={classes.content}>
            <MateBubble className={classes.bubble}>
              {container &&
                <a
                  href={container.url}
                  target="_blank"
                  className={classes.container}>
                  {container.name}
                </a>
              }
              <Grapedown text={title} user={user} />
              <Grapedown text={children} user={user} />
            </MateBubble>
          </div>
          {duplicates > 1 && <DuplicatesBadge value={duplicates} />}
        </div>
      </div>
    )
  }
}
