import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import {ActivityBubble as Bubble} from './Bubble'
import Expander from './Expander'
import DuplicatesBadge from './DuplicatesBadge'
import {styles} from './baseMessageTheme'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#activites
@injectSheet(styles)
export default class ActivityMessage extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    duplicates: PropTypes.number.isRequired,
    onToggleExpander: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    avatar: PropTypes.string,
    user: PropTypes.object,
    isExpanded: PropTypes.bool
  }

  static defaultProps = {
    children: '',
    title: '',
    hasBubbleArrow: true,
    onToggleExpander: noop
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onToggleExpander = ({isExpanded}) => {
    this.props.onToggleExpander({id: this.props.id, isExpanded})
  }

  render() {
    const {
      sheet, user, author, time, avatar, title, children, duplicates,
      isExpanded, hasBubbleArrow
    } = this.props
    const {classes} = sheet

    return (
      <div className={classes.message}>
        {author &&
          <div className={classes.row}>
            <div className={classes.avatarColumn}></div>
            <Header
              time={time}
              author={author.name}
              className={classes.header} />
          </div>
        }
        <div className={classes.row}>
          <div className={classes.avatarColumn}>
            {avatar && <Avatar src={avatar} className={classes.avatar} />}
          </div>
          <Bubble className={classes.bubble} hasArrow={hasBubbleArrow}>
            <Expander onToggle={this.onToggleExpander} isExpanded={isExpanded}>
              <div className={classes.content}>
                <Grapedown text={title} user={user} />
                <Grapedown text={children} user={user} />
              </div>
            </Expander>
          </Bubble>
          {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
        </div>
      </div>
    )
  }
}
