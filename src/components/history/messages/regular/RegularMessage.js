import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import {constants} from '../../../../conf'
import Avatar from '../../../avatar/Avatar'
import Grapedown from '../../../grapedown/Grapedown'
import {LinkAttachments} from '../../../message-parts'
import {defaultAvatar} from '../../../../constants/images'

import {OwnBubble, MateBubble, SelectedBubble} from './Bubbles'
import DuplicatesBadge from '../DuplicatesBadge'
import Attachment from '../Attachment'
import {styles} from './regularMessageTheme'
import UnsentWarning from './UnsentWarning'
import DeliveryState from './DeliveryState'
import Author from './Author'
import Menu from './Menu'
import Footer from './Footer'

const canPm = ({isPm, isOwn, author}) => (isPm ? false : Boolean(!isOwn && author && author.slug))

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#message
@injectSheet(styles)
export default class RegularMessage extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    userTime: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    linkAttachments: PropTypes.array.isRequired,
    customEmojis: PropTypes.object.isRequired,
    children: PropTypes.string.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isPm: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onEdit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onRemove: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onCopyLink: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onQuote: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    onGoToChannel: PropTypes.func.isRequired,
    onRemoveLinkAttachment: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    duplicates: PropTypes.number.isRequired,
    /**
     * Author and avatar are optional because we show them only for the first
     * message in the row.
     */
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string
    }),
    avatar: PropTypes.string,
    state: PropTypes.oneOf(['pending', 'sent', 'unsent', 'read']),
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
    duplicates: 0,
    attachments: [],
    linkAttachments: [],
    customEmojis: {},
    children: '',
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onGoToChannel: noop,
    onCopyLink: noop,
    onQuote: noop,
    onRemoveLinkAttachment: noop,
    time: new Date(),
    userTime: new Date().toISOString(),
    user: {},
    state: null,
    nlp: null
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

  onRefContent = (ref) => {
    this.content = ref
  }

  onRefBody = (ref) => {
    this.body = ref
  }

  onGoToChannel = () => {
    const {onGoToChannel, author} = this.props
    onGoToChannel(author.slug)
  }

  onResend = (e) => {
    e.preventDefault()
    this.props.onResend()
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
      state, isOwn, isSelected, attachments, customEmojis, duplicates,
      classes, linkAttachments, nlp
    } = this.props

    const {isMenuOpened} = this.state

    let Bubble
    if (isSelected) {
      Bubble = SelectedBubble
    } else {
      Bubble = isOwn ? OwnBubble : MateBubble
    }

    const onGoToChannel = canPm(this.props) ? this.onGoToChannel : undefined

    const isAdmin = user.role >= constants.roles.ROLE_ADMIN
    let onRemoveLinkAttachment = null
    if (isOwn || isAdmin) {
      onRemoveLinkAttachment = this.makeOnRemoveLinkAttachment()
    }
    const attachmentsProps = {
      attachments: linkAttachments,
      onRemove: onRemoveLinkAttachment,
      isAdmin
    }

    return (
      <div className={classes.message}>
        {author && <Author {...this.props} onClickAuthor={onGoToChannel} />}
        <div
          className={classes.row}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className={classes.avatarColumn}>
            {avatar &&
              <Avatar
                src={avatar}
                className={onGoToChannel ? classes.clickable : ''}
                onClick={onGoToChannel}
              />
            }
          </div>
          <div className={classes.contentWrapper}>
            <Bubble hasArrow={hasBubbleArrow}>
              <div
                ref={this.onRefContent}
                className={[
                  classes.content,
                  state === 'pending' || state === 'unsent' ? classes.disabled : ''
                ].join(' ')}
              >
                <Grapedown
                  text={children}
                  user={user}
                  customEmojis={customEmojis}
                />
                {attachments.map(this.renderAttachment)}
              </div>
              {isMenuOpened && <Menu {...this.props} getContentNode={this.getContentNode} />}
              {nlp && <Footer nlp={nlp} />}
            </Bubble>
            {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
            {linkAttachments.length > 0 && <LinkAttachments {...attachmentsProps} />}
          </div>
        </div>
        <DeliveryState state={state} time={time} classes={classes} />
        {state === 'unsent' && <UnsentWarning classes={classes} onResend={this.onResend} />}
      </div>
    )
  }
}
