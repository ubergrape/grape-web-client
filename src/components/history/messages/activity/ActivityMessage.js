import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'

import Avatar from '../../../avatar/Avatar'
import { Grapedown } from '../../../grapedown'
import Header from '../../../message-parts/Header'

import DuplicatesBadge from '../DuplicatesBadge'
import { styles } from '../baseMessageTheme'
import { LinkAttachments } from '../../../message-parts'
import { ActivityBubble, SelectedBubble } from './bubbles'
import Expander from './Expander'
import Menu from './Menu'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#activites
class ActivityMessage extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired,
    title: PropTypes.node,
    children: PropTypes.node,
    tag: PropTypes.string,
    duplicates: PropTypes.number.isRequired,
    onToggleExpander: PropTypes.func,
    onRemoveLinkAttachment: PropTypes.func,
    customEmojis: PropTypes.object.isRequired,
    onCopyLink: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    hasBubbleArrow: PropTypes.bool,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    avatar: PropTypes.string,
    user: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    isExpanded: PropTypes.bool,
    isSelected: PropTypes.bool,
    linkAttachments: PropTypes.array,
    isAdmin: PropTypes.bool,
    text: PropTypes.string,
  }

  static defaultProps = {
    children: '',
    title: '',
    tag: '',
    hasBubbleArrow: true,
    onToggleExpander: noop,
    onRemoveLinkAttachment: noop,
    author: null,
    avatar: null,
    isExpanded: false,
    isSelected: false,
    linkAttachments: [],
    isAdmin: false,
    text: '',
  }

  state = { isMenuOpened: false }

  onMouseEnter = () => {
    this.setState({ isMenuOpened: true })
  }

  onMouseLeave = () => {
    this.setState({ isMenuOpened: false })
  }

  onToggleExpander = ({ isExpanded }) => {
    const { onToggleExpander, id } = this.props
    onToggleExpander({ id, isExpanded })
  }

  onRefContent = ref => {
    this.content = ref
  }

  getContentNode = () => this.content

  renderMenu() {
    if (!this.state.isMenuOpened) return null
    const {
      user,
      channel,
      onCopyLink,
      onQuote,
      onRemove,
      text,
      linkAttachments,
      permissions,
    } = this.props

    return (
      <Menu
        isLinkAttachments={
          !text && linkAttachments && linkAttachments.length > 0
        }
        getContentNode={this.getContentNode}
        user={user}
        channel={channel}
        onCopyLink={onCopyLink}
        onQuote={onQuote}
        onRemove={onRemove}
        permissions={permissions}
      />
    )
  }

  render() {
    const {
      classes,
      user,
      author,
      time,
      avatar,
      title,
      tag,
      children,
      duplicates,
      isExpanded,
      hasBubbleArrow,
      onRemoveLinkAttachment,
      linkAttachments,
      isSelected,
      customEmojis,
      isAdmin,
      text,
    } = this.props

    const Bubble = isSelected ? SelectedBubble : ActivityBubble

    return (
      <div className={classes.message}>
        {author && (
          <div className={classes.row}>
            <div className={classes.avatarColumn} />
            <Header
              time={time}
              author={author.name}
              className={classes.header}
            />
          </div>
        )}
        <div className={classes.row}>
          <div className={classes.avatarColumn}>
            {avatar && <Avatar src={avatar} className={classes.avatar} />}
          </div>
          <div className={classes.contentWrapper}>
            <Bubble
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              className={classes.bubble}
              hasArrow={hasBubbleArrow}
            >
              <Expander
                onToggle={this.onToggleExpander}
                isExpanded={isExpanded}
              >
                <div className={classes.content} ref={this.onRefContent}>
                  <Grapedown
                    tag={tag}
                    customEmojis={customEmojis}
                    text={title}
                    user={user}
                  />
                  <Grapedown
                    tag={tag}
                    customEmojis={customEmojis}
                    text={children}
                    user={user}
                  />
                  {!text && (
                    <LinkAttachments
                      attachments={linkAttachments}
                      messageText={text}
                      isAdmin={isAdmin}
                      onRemove={onRemoveLinkAttachment}
                    />
                  )}
                </div>
              </Expander>
              {this.renderMenu()}
            </Bubble>
            {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
            {text && (
              <LinkAttachments
                attachments={linkAttachments}
                messageText={text}
                isAdmin={isAdmin}
                onRemove={onRemoveLinkAttachment}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(ActivityMessage)
