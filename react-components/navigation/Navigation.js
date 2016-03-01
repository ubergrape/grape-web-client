import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import Username from '../avatar-name/Username'
import Roomname from '../avatar-name/Roomname'
import {userStatusMap} from '../constants/app'
import style from './style'
import colors from 'grape-theme/dist/base-colors'

const maxUnread = 99

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPmManager: PropTypes.func.isRequired,
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
      showPmManager
    } = this.props

    const {classes} = sheet

    return (
      <ul className={classes.manage}>
        <li className={classes.manageItem}>
          <button
            className={classes.contacts}
            onClick={showPmManager}>
            Contacts
          </button>
        </li>
        <li className={classes.manageItem}>
          <button
            className={classes.channels}
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
    const {classes} = this.props.sheet
    return (
      <li
        key={room.id}
        className={`${classes.room} ${room.current ? classes.roomCurrent : ''}`}
        style={room.current ? {backgroundColor: `${room.color}`} : null}
        onClick={this.goToChannel.bind(this, room)}>
        <Roomname {...room} />
        {this.renderUnread(room)}
      </li>
    )
  }

  renderPm(pm) {
    const {classes} = this.props.sheet
    const {mate} = pm
    return (
      <li
        key={pm.id}
        className={`${classes.pm} ${pm.current ? classes.pmCurrent : ''}`}
        onClick={this.goToChannel.bind(this, pm)}>
        <Username
          statusBorderColor={pm.current ? colors.blue : colors.grayBlueLighter}
          avatar={mate.avatar}
          status={userStatusMap[mate.status]}
          name={mate.displayName} />
        {this.renderUnread(pm)}
      </li>
    )
  }

  renderRecentList() {
    const {recent} = this.props
    if (!recent.length) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.section}>
        <h2 className={`${classes.title} ${classes.recent}`}>Recent</h2>
        <ol className={classes.list}>
          {
            recent.slice(0, this.state.shift).map(channel => {
              if (channel.type === 'room') return this.renderRoom(channel)
              if (channel.type === 'pm') return this.renderPm(channel)
              return null
            })
          }
        </ol>
      </div>
    )
  }

  renderFavoritedList() {
    const {favorited} = this.props
    if (!favorited.length) return null

    const {classes} = this.props.sheet
    return (
      <div className={classes.section}>
        <h2 className={`${classes.title} ${classes.favorites}`}>Favorites</h2>
        <ol className={classes.list}>
          {
            favorited.map(channel => {
              if (channel.type === 'room') return this.renderRoom(channel)
              if (channel.type === 'pm') return this.renderPm(channel)
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
      <div
        ref="navigation"
        onScroll={::this.onScroll}
        className={classes.navigation}>
        {this.renderNavigation()}
      </div>
    )
  }
}
