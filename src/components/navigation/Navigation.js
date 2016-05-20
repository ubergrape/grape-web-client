import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Fuse from 'fuse.js'
import List from 'react-finite-list'
import colors from 'grape-theme/dist/base-colors'
import keyname from 'keyname'
import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

import Username from '../avatar-name/Username'
import Roomname from '../avatar-name/Roomname'
import {userStatusMap} from '../../constants/app'
import Filter from './Filter'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

const maxUnread = 99

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    shortcuts: PropTypes.array.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPmManager: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    focusGrapeInput: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    all: PropTypes.array.isRequired,
    favorited: PropTypes.array.isRequired,
    recent: PropTypes.array.isRequired,
    step: PropTypes.number
  }

  static defaultProps = {
    step: 10,
    shortcuts: ['mod+k']
  }

  constructor(props) {
    super(props)
    this.state = {
      shift: 20,
      filter: '',
      filtered: []
    }

    mousetrap.bindGlobal(props.shortcuts, ::this.onShortcut)
  }

  componentDidMount() {
    this.filter = findDOMNode(this.refs.filter)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.all !== this.props.all) {
      this.setState({
        fuse: new Fuse(
          nextProps.all,
          {keys: ['name', 'mate.displayName'], threshold: 0.3}
        )
      })
    }
  }

  onShortcut() {
    this.filter.focus()
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

  onSelectFiltered(channel) {
    this.goToChannel(channel)
  }

  onChangeFilter({target}) {
    const {value} = target
    const filtered = this.state.fuse.search(value)

    this.setState({
      filtered,
      filter: value,
      focused: filtered[0]
    })
  }

  onFocusFiltered(channel) {
    this.setState({focused: channel})
  }

  onKeyDownFilter(e) {
    const {list} = this.refs
    const keyName = keyname(e.keyCode)

    if (keyName === 'esc' && !this.filter.value) {
      this.filter.blur()
      this.props.focusGrapeInput()
    }

    if (!list) return
    switch (keyName) {
      case 'up':
        list.focus('prev')
        e.preventDefault()
        break
      case 'down':
        list.focus('next')
        e.preventDefault()
        break
      case 'enter':
        this.onSelectFiltered(this.state.focused)
        e.preventDefault()
        break
      default:
    }
  }

  goToChannel(channel) {
    this.props.goToChannel(channel.slug || channel.mate.slug)
    this.setState({
      filter: '',
      filtered: [],
      focused: null
    })
  }

  renderManageButtons() {
    if (this.state.filter) return null

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

  renderFilteredChannel({item: channel, focused}) {
    return this.renderChannel(channel, focused)
  }

  renderChannel(channel, focused) {
    if (channel.type === 'room') return this.renderRoom(channel, focused)
    if (channel.type === 'pm') return this.renderPm(channel, focused)
    return null
  }

  renderRoom(room, focused) {
    const {classes} = this.props.sheet

    let channelClass = classes.channel
    if (!this.state.filter && room.current) channelClass += ` ${classes.channelCurrent}`
    if (focused) channelClass += ` ${classes.channelFocused}`
    const key = `room${room.id}`
    return (
      <div
        key={key}
        className={channelClass}
        onClick={this.goToChannel.bind(this, room)}>
        <Roomname {...room} />
        {this.renderUnread(room)}
      </div>
    )
  }

  renderPm(pm, focused) {
    const {classes} = this.props.sheet
    const {mate} = pm

    let channelClass = classes.channel
    if (!this.state.filter && pm.current) channelClass += ` ${classes.channelCurrent}`
    if (focused) channelClass += ` ${classes.channelFocused}`
    const key = `pm${pm.id}`
    return (
      <div
        key={key}
        className={channelClass}
        onClick={this.goToChannel.bind(this, pm)}>
        <Username
          statusBorderColor={colors.grayBlueLighter}
          avatar={mate.avatar}
          status={userStatusMap[mate.status]}
          name={mate.displayName} />
        {this.renderUnread(pm)}
      </div>
    )
  }

  renderRecentList() {
    const {recent} = this.props
    if (!recent.length) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.section}>
        <h2 className={`${classes.title} ${classes.recent}`}>Recent</h2>
        <div className={classes.list}>
          {recent.slice(0, this.state.shift).map(channel => this.renderChannel(channel))}
        </div>
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
        <div className={classes.list}>
          {favorited.map(channel => this.renderChannel(channel))}
        </div>
      </div>
    )
  }

  renderFilteredList() {
    const {filter, filtered, focused} = this.state
    const {classes} = this.props.sheet
    if (!filtered.length) {
      return (
        <div className={classes.notFound}>
          {'There\'s nothing that matches '}
          <strong>{filter}</strong>
        </div>
      )
    }
    return (
      <List
        items={filtered}
        renderItem={::this.renderFilteredChannel}
        onSelect={::this.onSelectFiltered}
        onFocus={::this.onFocusFiltered}
        onMouseOver={::this.onFocusFiltered}
        focused={focused}
        ref="list" />
    )
  }

  renderList() {
    if (this.state.filter) return this.renderFilteredList()

    return (
      <div>
        {this.renderFavoritedList()}
        {this.renderRecentList()}
      </div>
    )
  }

  renderNavigation() {
    if (this.props.isLoading) return null
    return (
      <div className={this.props.sheet.classes.navigationWrapper}>
        {this.renderManageButtons()}
        {this.renderList()}
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.wrapper}>
        <div
          ref="navigation"
          onScroll={::this.onScroll}
          className={classes.navigation}>
          {this.renderNavigation()}
        </div>
        <div className={classes.filter}>
          <Filter
            ref="filter"
            theme={{classes}}
            {...this.props}
            {...this.state}
            onKeyDown={::this.onKeyDownFilter}
            onChange={::this.onChangeFilter} />
        </div>
      </div>
    )
  }
}
