import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {useSheet} from 'grape-web/lib/jss'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import {MateBubble} from './Bubble'
import {styles} from './activityMessageTheme'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#activites
@useSheet(styles)
export default class ActivityMessage extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    avatar: PropTypes.string.isRequired,
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

  getTitle = () => (this.props.title)

  getText = () => (this.props.children)

  render() {
    const {
      sheet, user, author, time, avatar, container
    } = this.props
    const {classes} = sheet

    return (
      <div className={classes.message}>
        <Header
          time={time}
          author={author.name}
          className={classes.header} />
        <div className={classes.body}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <MateBubble className={classes.bubble}>
            {container &&
              <a
                href={container.url}
                target="_blank"
                className={classes.container}>
                {container.name}
              </a>
            }
            <Grapedown text={this.getTitle} user={user} />
            <Grapedown text={this.getText} user={user} />
          </MateBubble>
        </div>
      </div>
    )
  }
}
