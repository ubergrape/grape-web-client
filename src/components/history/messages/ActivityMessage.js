import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'

import {ActivityBubble as Bubble} from './Bubble'
import Expander from './Expander'
import DuplicatesBadge from './DuplicatesBadge'
import Attachment from './Attachment'
import {styles} from './baseMessageTheme'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#activites
@injectSheet(styles)
export default class ActivityMessage extends PureComponent {
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

  onToggleExpander = ({isExpanded}) => {
    this.props.onToggleExpander({id: this.props.id, isExpanded})
  }

  renderAttachment = (attachment, key) => {
    return <Attachment {...attachment} key={key} />
  }

  render() {
    const {
      sheet: {classes}, user, author, time, avatar, title, children, duplicates,
      isExpanded, hasBubbleArrow, attachments
    } = this.props

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
                {attachments.map(this.renderAttachment)}
              </div>
            </Expander>
          </Bubble>
          {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
        </div>
      </div>
    )
  }
}
