import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { noop } from 'lodash'
import cn from 'classnames'

import Avatar from '../../../avatar/Avatar'
import { Grapedown } from '../../../grapedown'
import { LinkAttachments } from '../../../message-parts'
import { defaultAvatar } from '../../../../../constants/images'
import { messageDeliveryStates } from '../../../../../constants/app'

import getBubble from './getBubble'
import iconTagMap from './iconTagMap'
import DuplicatesBadge from '../DuplicatesBadge'
import { styles } from './regularMessageTheme'
import UnsentWarning from './UnsentWarning'
import DeliveryState from './DeliveryState'
import Author from './Author'
import Menu from './Menu'
import Footer from './Footer'

const canPm = ({ isPm, isOwn, author }) =>
  isPm ? false : Boolean(!isOwn && author && author.id)

const toggleMenuDropdown = state => ({
  isMenuDropdownOpened: !state.isMenuDropdownOpened,
})

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#message
class RegularMessage extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired,
    linkAttachments: PropTypes.array,
    customEmojis: PropTypes.object,
    children: PropTypes.string,
    hasBubbleArrow: PropTypes.bool,
    permissions: PropTypes.object.isRequired,
    isOwn: PropTypes.bool,
    isSelected: PropTypes.bool,
    isPinned: PropTypes.bool,
    /* eslint-disable react/no-unused-prop-types */
    userTime: PropTypes.string,
    isPm: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onCopyLink: PropTypes.func,
    onQuote: PropTypes.func,
    /* eslint-enable react/no-unused-prop-types */
    onResend: PropTypes.func,
    onOpenPm: PropTypes.func,
    onRemoveLinkAttachment: PropTypes.func,
    onPin: PropTypes.func.isRequired,
    onUnpin: PropTypes.func.isRequired,
    user: PropTypes.object,
    duplicates: PropTypes.number,
    /**
     * Author and avatar are optional because we show them only for the first
     * message in the row.
     */
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    avatar: PropTypes.string,
    state: PropTypes.oneOf(messageDeliveryStates),
    nlp: PropTypes.object,
    id: PropTypes.string,
    channelId: PropTypes.number,
    text: PropTypes.string,
    tag: PropTypes.string,
    docType: PropTypes.string,
    action: PropTypes.string,
    isAdmin: PropTypes.bool,
  }

  static defaultProps = {
    id: '0',
    channelId: 0,
    avatar: defaultAvatar,
    author: null,
    hasBubbleArrow: true,
    isOwn: false,
    isSelected: false,
    isPm: false,
    isPinned: false,
    duplicates: 0,
    linkAttachments: [],
    customEmojis: {},
    children: '',
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onOpenPm: noop,
    onCopyLink: noop,
    onQuote: noop,
    onRemoveLinkAttachment: noop,
    userTime: new Date().toISOString(),
    user: {},
    state: undefined,
    nlp: undefined,
    text: '',
    tag: '',
    docType: '',
    action: '',
    isAdmin: false,
  }

  state = {
    isMenuOpened: false,
    isMenuDropdownOpened: false,
  }

  onMouseEnter = () => {
    this.setState({ isMenuOpened: true })
  }

  onMouseLeave = () => {
    if (!this.state.isMenuDropdownOpened) {
      this.setState({ isMenuOpened: false })
    }
  }

  onRefContent = ref => {
    this.content = ref
  }

  onRefBody = ref => {
    this.body = ref
  }

  onOpenPm = () => {
    const { onOpenPm, author } = this.props
    onOpenPm(author.id)
  }

  onResend = e => {
    e.preventDefault()
    this.props.onResend()
  }

  onPin = () => {
    const { id, channelId } = this.props
    this.props.onPin({ messageId: id, channelId })
  }

  onUnpin = () => {
    const { id, channelId } = this.props
    this.props.onUnpin({ messageId: id, channelId })
  }

  onToggleMenuDropdown = isMenuDropdownOpened => {
    if (isMenuDropdownOpened != null) this.setState({ isMenuDropdownOpened })
    else this.setState(toggleMenuDropdown)
  }

  getContentNode = () => this.content

  makeOnRemoveLinkAttachment = () => {
    const { id: messageId, channelId, onRemoveLinkAttachment } = this.props

    return ({ url, isAdmin }) => {
      onRemoveLinkAttachment({
        channelId,
        messageId,
        url,
        isAdmin,
      })
    }
  }

  render() {
    const {
      author,
      user,
      time,
      avatar,
      children,
      hasBubbleArrow,
      state,
      permissions,
      isOwn,
      isSelected,
      isPinned,
      customEmojis,
      duplicates,
      classes,
      linkAttachments,
      nlp,
      text,
      tag,
      docType,
      action,
      isAdmin,
    } = this.props

    const { isMenuOpened, isMenuDropdownOpened } = this.state

    const Bubble = getBubble({ isSelected, isPinned, isOwn, state })
    const onOpenPm = canPm(this.props) ? this.onOpenPm : undefined
    const statusIcon = iconTagMap[tag]

    let onRemoveLinkAttachment
    if (isOwn || isAdmin) {
      onRemoveLinkAttachment = this.makeOnRemoveLinkAttachment()
    }

    return (
      <div className={classes.message}>
        {author && <Author {...this.props} onClickAuthor={onOpenPm} />}
        <div className={classes.row}>
          <div className={classes.avatarColumn}>
            {avatar && (
              <Avatar
                src={avatar}
                className={onOpenPm ? classes.clickable : ''}
                onClick={onOpenPm}
              />
            )}
          </div>
          <div className={classes.contentWrapper}>
            <Bubble
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              hasArrow={hasBubbleArrow}
            >
              <div
                ref={this.onRefContent}
                className={cn(
                  classes.content,
                  state === 'pending' && classes.disabled,
                )}
              >
                {tag && <div className={classes.actionText}>{action}</div>}
                {/* Oleh: I'm doing this because data which comes as text should be rendered beside with status icon.
                  In case if in future it will be possible to swap `text` and `actions` fields from backend side,
                  please change code below to more clean solution,
                  like here: https://github.com/ubergrape/grape-web-client/pull/956/commits/491c0d2a02c92646cda9d896fcfb6f54ee8d8ae9.
                  I can't do this because lack of time from another clients developers. And they're already
                  imlemented solution with those field names.
                */}
                {docType === 'system' && tag ? (
                  <div className={classes.action}>
                    <div className={classes.iconWrapper}>
                      <Icon className={classes[statusIcon]} name={statusIcon} />
                    </div>
                    {children && (
                      <Grapedown
                        tag={tag}
                        text={children}
                        user={user}
                        customEmojis={customEmojis}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    {children && (
                      <Grapedown
                        tag={tag}
                        text={children}
                        user={user}
                        customEmojis={customEmojis}
                      />
                    )}
                  </div>
                )}
                {!text && (
                  <LinkAttachments
                    attachments={linkAttachments}
                    messageText={text}
                    isAdmin={isAdmin}
                    onRemove={onRemoveLinkAttachment}
                  />
                )}
              </div>
              {isMenuOpened && (
                <Menu
                  {...this.props}
                  isLinkAttachments={
                    !text && linkAttachments && linkAttachments.length > 0
                  }
                  onSelect={this.onSelectMenuItem}
                  isDropdownOpened={isMenuDropdownOpened}
                  getContentNode={this.getContentNode}
                  onPin={this.onPin}
                  onUnpin={this.onUnpin}
                  permissions={permissions}
                  onToggleDropdown={this.onToggleMenuDropdown}
                />
              )}
              {nlp && <Footer nlp={nlp} />}
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
        <DeliveryState state={state} time={time} />
        {state === 'unsent' && (
          <UnsentWarning classes={classes} onResend={this.onResend} />
        )}
      </div>
    )
  }
}

export default injectSheet(styles)(RegularMessage)
