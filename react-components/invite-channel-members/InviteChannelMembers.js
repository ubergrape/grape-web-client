import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'


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
    console.log('INVITE')
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

  getItems() {
    return this.props.users.map(user => {
      user.render = this.renderUser(user)
      return user
    })
  }

  getSelectedItems() {
    return this.props.listedForInvite.map(user => {
      user.render = this.renderSelectedUser(user)
      return user
    })
  }

  renderUser(user) {
    return (
      <button>{user.displayName}</button>
    )
  }

  renderSelectedUser(user) {
    return user.displayName
  }

  renderNotFound(value) {
    return (
      <div>
        {'No one found for '}
        <strong>{value}</strong>
      </div>
    )
  }

  renderEmptyItems(value) {
    return (
      <div>
        Everyone has been invited to this room
      </div>
    )
  }

  renderButton() {
    if (!this.props.users.length) return null

    const {listedForInvite} = this.props
    return (
      <div>
        <button
          onClick={::this.onInviteUsersClick}
          disabled={!(listedForInvite && listedForInvite.length)}>
          <i className="fa fa-user-plus"></i>
          Invite members
        </button>
      </div>
    )
  }

  renderFilterable() {
    return (
      <Dialog
        show={this.props.show}
        onHide={::this.onHide}
        title="Invite to room">
        <FilterableList
          onSelect={::this.onSelect}
          onSelectedClick={::this.onSelectedClick}
          items={this.getItems()}
          selected={this.getSelectedItems()}
          filter={this.filter}
          sort={this.sort}
          renderNotFound={this.renderNotFound}
          renderEmptyItems={this.renderEmptyItems}>
          <button onClick={::this.onInviteToOrgClick}>Invite a new person to your team</button>
        </FilterableList>
        {this.renderButton()}
      </Dialog>
    )
  }

  render() {
    return this.renderFilterable()
  }
}
