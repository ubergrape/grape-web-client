import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import {
  filterUserByValue,
  sortUserByValue
} from './utils'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import AvatarUsername from '../avatar-username/AvatarUsername'
import {userStatus} from '../constants/app'

import colors from 'grape-theme/dist/base-colors'

@useSheet(style)
export default class ChannelMembersInvite extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    addToChannelMembersInvite: PropTypes.func.isRequired,
    removeFromChannelMembersInvite: PropTypes.func.isRequired,
    showOrgInvite: PropTypes.func.isRequired,
    inviteToChannel: PropTypes.func.isRequired,
    createRoomAndInvite: PropTypes.func.isRequired,
    hideChannelMembersInvite: PropTypes.func.isRequired,
    setInviteFilterValue: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    filter: PropTypes.string.isRequired,
    isInviter: PropTypes.bool.isRequired,
    channelType: PropTypes.string,
    show: PropTypes.bool.isRequired
  }

  onSelectUser(user) {
    this.props.addToChannelMembersInvite(user)
  }

  onRemoveSelectedUser(user) {
    this.props.removeFromChannelMembersInvite(user)
  }

  onInviteToOrgClick() {
    this.onHide()
    this.props.showOrgInvite()
  }

  onInviteUsersClick() {
    const {
      listed,
      inviteToChannel,
      createRoomAndInvite,
      channelType
    } = this.props

    if (!listed.length) return
    if (channelType === 'room') inviteToChannel(listed.map(user => user.username))
    if (channelType === 'pm') createRoomAndInvite(listed)

    this.onHide()
  }

  onHide() {
    this.props.hideChannelMembersInvite()
  }

  onChangeFilter(value) {
    this.props.setInviteFilterValue(value)
  }

  getUsers() {
    const {users, filter} = this.props
    if (!filter) return users
    return users
      .filter(filterUserByValue.bind(null, filter))
      .sort(sortUserByValue.bind(null, filter))
  }

  renderUser({item, focused}) {
    const {displayName, avatar, status} = item
    const {user, focusedUser} = this.props.sheet.classes
    let className = user
    if (focused) className += ` ${focusedUser}`
    return (
      <div
        className={className}>
        <AvatarUsername
          username={displayName}
          avatar={avatar}
          statusBorderColor={focused ? colors.grayBlueLighter : colors.white}
          status={userStatus[status]}
        />
      </div>
    )
  }

  renderSelectedUser(user) {
    return user.displayName
  }

  renderNotFound(value) {
    return (
      <div
        className={this.props.sheet.classes.note}>
        {'No one found for '}
        <strong>{value}</strong>
      </div>
    )
  }

  renderNoUsers() {
    return (
      <div
        className={this.props.sheet.classes.note}>
        Everyone has been invited to this room
      </div>
    )
  }

  renderInviteButton() {
    const {listed, channelType, sheet} = this.props

    return (
      <div className={sheet.classes.submit}>
        <button
          className={sheet.classes.buttonInvite}
          onClick={::this.onInviteUsersClick}
          disabled={!listed.length}>
          {channelType === 'pm' ? 'Create room' : 'Invite members'}
        </button>
      </div>
    )
  }

  renderOrgInviteButton() {
    if (!this.props.isInviter) return null
    const {
      orgInvite,
      orgInviteButton
    } = this.props.sheet.classes

    return (
      <div className={orgInvite}>
        <button
          className={orgInviteButton}
          onClick={::this.onInviteToOrgClick}>
          Invite a new person to your team…
        </button>
      </div>
    )
  }

  renderTitle() {
    switch (this.props.channelType) {
      case 'room':
        return 'Invite to room'
      case 'pm':
        return 'Create new private room'
      default:
        return ''
    }
  }

  render() {
    const {
      sheet,
      show,
      filter,
      listed
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={::this.onHide}
        title={this.renderTitle()}>
        <div
          className={sheet.classes.wrapper}>
          <FilterableList
            listClassName={sheet.classes.list}
            filter={filter}
            items={this.getUsers()}
            selected={listed}
            onChange={::this.onChangeFilter}
            onSelect={::this.onSelectUser}
            onRemoveSelected={::this.onRemoveSelectedUser}
            renderItem={::this.renderUser}
            renderSelected={this.renderSelectedUser}
            renderNotFound={::this.renderNotFound}
            renderEmptyItems={::this.renderNoUsers}>
            {this.renderOrgInviteButton()}
          </FilterableList>
          {this.renderInviteButton()}
        </div>
      </Dialog>
    )
  }
}
