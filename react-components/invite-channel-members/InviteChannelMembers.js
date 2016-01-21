import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import AvatarUsername from '../avatar-username/AvatarUsername'

import colors from 'grape-theme/dist/base-colors'

@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    users: []
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

  filter(value, user) {
    return user.username.toLowerCase().indexOf(value) >= 0 ||
      user.displayName.toLowerCase().indexOf(value) >= 0
  }

  sort(value, a) {
    if (
      a.username.toLowerCase().startsWith(value) ||
      a.displayName.toLowerCase().startsWith(value)
    ) {
      return -1
    }
    return 1
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
              onSelect={::this.onSelect}
              onSelectedClick={::this.onSelectedClick}
              items={this.props.users}
              selected={this.props.listedForInvite}
              filter={this.filter}
              sort={this.sort}
              itemClassName={item}
              itemFocusedClassName={focusedItem}
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
