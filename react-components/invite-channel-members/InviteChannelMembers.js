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

import colors from 'grape-theme/dist/base-colors'

@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  onSelect(user) {
    console.log('onClick', user)
    this.props.addToInviteChannelMemberList(user)
  }

  onSelectedClick(user) {
    console.log('onSelectedClick', user)
    this.props.removeFromInviteChannelMemberList(user)
  }

  onInviteToOrgClick() {
    this.onHide()
    this.props.showOrgInvite()
  }

  onInviteUsersClick() {
    const {listedForInvite} = this.props
    if (!listedForInvite.length) return
    this.props.inviteToCurrentChannel(listedForInvite)
    this.onHide()
  }

  onHide() {
    this.props.hideInviteChannelMemberList()
  }

  onChangeFilter(value) {
    this.props.setInviteFilterValue(value)
  }

  getUsers() {
    const {users, value} = this.props
    if (!value) return users
    return users
      .filter(filterUserByValue.bind(null, value))
      .sort(sortUserByValue.bind(null, value))
  }

  renderUser(user, focused) {
    const {displayName, avatar, status} = user
    return (
      <AvatarUsername
        username={displayName}
        avatar={avatar}
        statusBorderColor={focused ? colors.grayBlueLighter : colors.white}
        status={status == 16 ? 'online' : 'offline'}
      />
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

  renderEmptyItems(value) {
    return (
      <div
        className={this.props.sheet.classes.note}>
        Everyone has been invited to this room
      </div>
    )
  }

  renderInviteButton() {
    const {listedForInvite} = this.props
    const {buttonInvite, submit} = this.props.sheet.classes

    return (
      <div className={submit}>
        <button
          className={buttonInvite}
          onClick={::this.onInviteUsersClick}
          disabled={!(listedForInvite && listedForInvite.length)}>
          Invite members
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

  renderFilterable() {
    const {
      wrapper,
      list,
      item,
      focusedItem
    } = this.props.sheet.classes

    const users = this.getUsers()
    return (
      <Dialog
        show={this.props.show}
        onHide={::this.onHide}
        title="Invite to room">
        <div
          className={wrapper}>
          <div className={list}>
            <FilterableList
              height="180"
              filter={this.props.filter}
              items={users}
              selected={this.props.listed}
              onChange={::this.onChangeFilter}
              onSelect={::this.onSelect}
              onSelectedClick={::this.onSelectedClick}
              itemClassName={item}
              itemFocusedClassName={focusedItem}
              focused={users.length > 0}
              renderItem={this.renderUser}
              renderSelected={this.renderSelectedUser}
              renderNotFound={::this.renderNotFound}
              renderEmptyItems={::this.renderEmptyItems}>
              {this.renderOrgInviteButton()}
            </FilterableList>
          </div>
          {this.renderInviteButton()}
        </div>
      </Dialog>
    )
  }

  render() {
    return this.renderFilterable()
  }
}
