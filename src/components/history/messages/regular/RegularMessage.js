import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import cn from 'classnames'

import conf from '../../../../conf'
import Avatar from '../../../avatar/Avatar'
import {Grapedown} from '../../../grapedown'
import {LinkAttachments} from '../../../message-parts'
import {defaultAvatar} from '../../../../constants/images'
import {messageDeliveryStates} from '../../../../constants/app'

import getBubble from './getBubble'
import DuplicatesBadge from '../DuplicatesBadge'
import Attachment from '../Attachment'
import {styles} from './regularMessageTheme'
import UnsentWarning from './UnsentWarning'
import DeliveryState from './DeliveryState'
import Author from './Author'
import Menu from './Menu'
import Footer from './Footer'

const canPm = ({isPm, isOwn, author}) => (isPm ? false : Boolean(!isOwn && author && author.id))

const toggleMenuDropdown = state => ({isMenuDropdownOpened: !state.isMenuDropdownOpened})

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#message
@injectSheet(styles)
export default class RegularMessage extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    attachments: PropTypes.array.isRequired,
    linkAttachments: PropTypes.array.isRequired,
    customEmojis: PropTypes.object.isRequired,
    children: PropTypes.string.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isPinned: PropTypes.bool.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    userTime: PropTypes.string.isRequired,
    isPm: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    /* eslint-enable react/no-unused-prop-types */
    onResend: PropTypes.func.isRequired,
    onGoToPmChannel: PropTypes.func.isRequired,
    onRemoveLinkAttachment: PropTypes.func.isRequired,
    onPin: PropTypes.func.isRequired,
    onUnpin: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    duplicates: PropTypes.number.isRequired,
    /**
     * Author and avatar are optional because we show them only for the first
     * message in the row.
     */
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }),
    avatar: PropTypes.string,
    state: PropTypes.oneOf(messageDeliveryStates),
    nlp: PropTypes.object,
    id: PropTypes.string.isRequired,
    channelId: PropTypes.number.isRequired
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
    attachments: [],
    linkAttachments: [],
    customEmojis: {},
    children: '',
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onGoToPmChannel: noop,
    onCopyLink: noop,
    onQuote: noop,
    onRemoveLinkAttachment: noop,
    time: new Date(),
    userTime: new Date().toISOString(),
    user: {},
    state: undefined,
    nlp: undefined
  }

  state = {
    isMenuOpened: false,
    isMenuDropdownOpened: false
  }

  onMouseEnter = () => {
    this.setState({isMenuOpened: true})
  }

  onMouseLeave = () => {
    if (!this.state.isMenuDropdownOpened) {
      this.setState({isMenuOpened: false})
    }
  }

  onRefContent = (ref) => {
    this.content = ref
  }

  onRefBody = (ref) => {
    this.body = ref
  }

  onGoToPmChannel = () => {
    const {onGoToPmChannel, author} = this.props
    onGoToPmChannel(author.id)
  }

  onResend = (e) => {
    e.preventDefault()
    this.props.onResend()
  }

  onPin = () => {
    const {id, channelId} = this.props
    this.props.onPin({messageId: id, channelId})
  }

  onUnpin = () => {
    const {id, channelId} = this.props
    this.props.onUnpin({messageId: id, channelId})
  }

  onToggleMenuDropdown = (isMenuDropdownOpened) => {
    if (isMenuDropdownOpened != null) this.setState({isMenuDropdownOpened})
    else this.setState(toggleMenuDropdown)
  }

  getContentNode = () => this.content

  makeOnRemoveLinkAttachment = () => {
    const {
      id: messageId,
      channelId,
      onRemoveLinkAttachment
    } = this.props

    return ({url, isAdmin}) => {
      onRemoveLinkAttachment({
        channelId,
        messageId,
        url,
        isAdmin
      })
    }
  }

  renderAttachment = (attachment, key) => <Attachment {...attachment} key={key} />

  render() {
    const {
      author, user, time, avatar, children, hasBubbleArrow,
      state, isOwn, isSelected, isPinned, attachments, customEmojis, duplicates,
      classes, linkAttachments, nlp
    } = this.props

    const {isMenuOpened, isMenuDropdownOpened} = this.state

    const Bubble = getBubble({isSelected, isPinned, isOwn})

    const onGoToPmChannel = canPm(this.props) ? this.onGoToPmChannel : undefined

    const isAdmin = user.role >= conf.constants.roles.ROLE_ADMIN
    let onRemoveLinkAttachment
    if (isOwn || isAdmin) {
      onRemoveLinkAttachment = this.makeOnRemoveLinkAttachment()
    }

    return (
      <div className={classes.message}>
        {author && <Author {...this.props} onClickAuthor={onGoToPmChannel} />}
        <div
          className={classes.row}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className={classes.avatarColumn}>
            {avatar &&
              <Avatar
                src={avatar}
                className={onGoToPmChannel ? classes.clickable : ''}
                onClick={onGoToPmChannel}
              />
            }
          </div>
          <div className={classes.contentWrapper}>
            <Bubble hasArrow={hasBubbleArrow}>
              <div
                ref={this.onRefContent}
                className={cn(
                  classes.content,
                  (state === 'pending' || state === 'unsent') && classes.disabled
                )}
              >
                {children && (
                  <Grapedown
                    text={children}
                    user={user}
                    customEmojis={customEmojis}
                  />
                )}
                {attachments.map(this.renderAttachment)}
              </div>
              {isMenuOpened && (
                <Menu
                  {...this.props}
                  onSelect={this.onSelectMenuItem}
                  hasAttachments={attachments.length !== 0}
                  isDropdownOpened={isMenuDropdownOpened}
                  getContentNode={this.getContentNode}
                  onPin={this.onPin}
                  onUnpin={this.onUnpin}
                  onToggleDropdown={this.onToggleMenuDropdown}
                />
              )}
              {nlp && <Footer nlp={nlp} />}
            </Bubble>
            {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
            { /* We are migrating towards using link attachments only */
              !attachments.length && linkAttachments.length > 0 && (
                <LinkAttachments
                  attachments={linkAttachments}
                  isAdmin={isAdmin}
                  onRemove={onRemoveLinkAttachment}
                />
              )
            }
          </div>
        </div>
        <DeliveryState state={state} time={time} />
        {state === 'unsent' && <UnsentWarning classes={classes} onResend={this.onResend} />}
      </div>
    )
  }
}
