import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import Menu from '../../message-parts/Menu'

import {ActivityBubble, SelectedBubble} from './Bubble'
import Expander from './Expander'
import DuplicatesBadge from './DuplicatesBadge'
import Attachment from './Attachment'
import {styles} from './baseMessageTheme'

const menuItems = ['copyLink', 'quote']

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
    onCopyLink: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    avatar: PropTypes.string,
    user: PropTypes.object.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    attachments: PropTypes.array.isRequired
  }

  static defaultProps = {
    children: '',
    title: '',
    hasBubbleArrow: true,
    onToggleExpander: noop,
    author: null,
    avatar: null,
    isExpanded: false,
    isSelected: false,
    attachments: []
  }

  constructor(props) {
    super(props)
    this.state = {isMenuOpened: false}
  }

  onMouseEnter = () => {
    this.setState({isMenuOpened: true})
  }

  onMouseLeave = () => {
    this.setState({isMenuOpened: false})
  }

  onToggleExpander = ({isExpanded}) => {
    const {onToggleExpander, id} = this.props
    onToggleExpander({id, isExpanded})
  }

  onRefContent = (ref) => {
    this.content = ref
  }

  onSelectMenuItem = ({name}) => {
    const {onCopyLink, onQuote} = this.props
    if (name === 'copy') onCopyLink()
    else onQuote()
  }

  getContentNode = () => this.content

  renderAttachment = (attachment, key) => <Attachment {...attachment} key={key} />

  renderMenu() {
    if (!this.state.isMenuOpened) return null

    return (
      <Menu
        onSelect={this.onSelectMenuItem}
        getContentNode={this.getContentNode}
        items={menuItems}
      />
    )
  }

  render() {
    const {
      sheet: {classes}, user, author, time, avatar, title, children, duplicates,
      isExpanded, hasBubbleArrow, attachments, isSelected
    } = this.props

    const Bubble = isSelected ? SelectedBubble : ActivityBubble

    return (
      <div className={classes.message}>
        {author &&
          <div className={classes.row}>
            <div className={classes.avatarColumn} />
            <Header
              time={time}
              author={author.name}
              className={classes.header}
            />
          </div>
        }
        <div
          className={classes.row}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className={classes.avatarColumn}>
            {avatar && <Avatar src={avatar} className={classes.avatar} />}
          </div>
          <Bubble className={classes.bubble} hasArrow={hasBubbleArrow}>
            <Expander onToggle={this.onToggleExpander} isExpanded={isExpanded}>
              <div className={classes.content} ref={this.onRefContent}>
                <Grapedown text={title} user={user} />
                <Grapedown text={children} user={user} />
                {attachments.map(this.renderAttachment)}
              </div>
            </Expander>
            {this.renderMenu()}
          </Bubble>
          {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
        </div>
      </div>
    )
  }
}
