import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import AvatarUsername from '../avatar-username/AvatarUsername'
import AvatarRoomname from '../avatar-roomname/AvatarRoomname'
import {userStatus} from '../constants/app'
import style from './style'
import colors from 'grape-theme/dist/base-colors'

const maxUnread = 99

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPMsManager: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    favorited: PropTypes.array.isRequired,
    recent: PropTypes.array.isRequired,
    step: PropTypes.number
  }

  static defaultProps = {
    step: 10
  }

  constructor(props) {
    super(props)
    this.state = {
      shift: 20
    }
  }

  onScroll(e) {
    if (this.state.shift >= this.props.recent.length) return

    const {offsetHeight, scrollTop, scrollHeight} = e.target
    if (offsetHeight + scrollTop >= scrollHeight) {
      this.setState({
        shift: this.state.shift + this.props.step
      })
    }
  }

  goToChannel(channel) {
    this.props.goToChannel(channel.slug || channel.mate.slug)
  }

  renderManageButtons() {
    const {
      sheet,
      showChannelsManager,
      showPMsManager
    } = this.props

    return (
      <ul className={sheet.classes.manage}>
        <li className={sheet.classes.manageItem}>
          <button
            className={sheet.classes.contacts}
            onClick={showPMsManager}>
            Contacts
          </button>
        </li>
        <li className={sheet.classes.manageItem}>
          <button
            className={sheet.classes.groups}
            onClick={showChannelsManager}>
            Groups
          </button>
        </li>
      </ul>
    )
  }

  renderUnread({type, unread, mentioned}) {
    if (!unread) return null

    const unreadCount = unread > maxUnread ? `${maxUnread}+` : unread
    const mention = type === 'room' && mentioned ? '@' : ''

    const {classes} = this.props.sheet
    let className = `${classes.sign} `
    className += mention || type === 'pm' ? classes.importantSign : classes.defaultSign
    return (
      <span className={className}>
        {mention + unreadCount}
      </span>
    )
  }

  renderRoom(room) {
    const {sheet, channel} = this.props
    const isCurrent = channel.type === 'room' && channel.id === room.id
    let className = sheet.classes.channel
    if (isCurrent) className += ` ${sheet.classes.currentChannel}`
    return (
      <li
        key={room.id}
        className={className}
        onClick={this.goToChannel.bind(this, room)}>
        <AvatarRoomname {...room} />
        {this.renderUnread(room)}
      </li>
    )
  }

  renderPM(pm) {
    const {sheet, channel} = this.props
    const {mate} = pm
    const isCurrent = channel.type === 'pm' && channel.id === pm.id
    let className = sheet.classes.channel
    if (isCurrent) className += ` ${sheet.classes.currentChannel}`
    return (
      <li
        key={pm.id}
        className={className}
        onClick={this.goToChannel.bind(this, pm)}>
        <AvatarUsername
          statusBorderColor={isCurrent ? colors.white : colors.grayBlueLighter}
          avatar={mate.avatar}
          status={userStatus[mate.status]}
          name={mate.displayName} />
        {this.renderUnread(pm)}
      </li>
    )
  }

  renderRecentList() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.section}>
        <h2 className={`${classes.title} ${classes.recent}`}>Recent</h2>
        <ol className={classes.list}>
          {
            this.props.recent.slice(0, this.state.shift).map(channel => {
              if (channel.type === 'room') return this.renderRoom(channel)
              if (channel.type === 'pm') return this.renderPM(channel)
              return null
            })
          }
        </ol>
      </div>
    )
  }

  renderFavoritedList() {
    if (!this.props.favorited.length) return null

    const {classes} = this.props.sheet
    return (
      <div className={classes.section}>
        <h2 className={`${classes.title} ${classes.favorites}`}>Favorites</h2>
        <ol className={classes.list}>
          {
            this.props.favorited.map(channel => {
              if (channel.type === 'room') return this.renderRoom(channel)
              if (channel.type === 'pm') return this.renderPM(channel)
              return null
            })
          }
        </ol>
      </div>
    )
  }

  renderNavigation() {
    if (this.props.isLoading) return null
    return (
      <div className={this.props.sheet.classes.wrapper}>
        {this.renderManageButtons()}
        {this.renderFavoritedList()}
        {this.renderRecentList()}
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div>
        <div
          ref="navigation"
          onScroll={::this.onScroll}
          className={classes.navigation}>
          {this.renderNavigation()}
        </div>
      </div>
    )
  }
}
