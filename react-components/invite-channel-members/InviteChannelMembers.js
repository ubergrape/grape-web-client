import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import FilterableList from '../filterable-list/FilterableList'


@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nexProps) {
    console.log(nexProps)
  }

  onSelect(user) {
    console.log('onClick', user)
    this.props.addToInviteList(user)
  }

  onSelectedClick(user) {
    console.log('onSelectedClick', user)
    this.props.removeFromInviteList(user)
  }

  onInviteClick() {
    console.log('INVITE')
  }

  filter(value, user) {
    console.log(value, user)
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
    return (
      `> ${user.displayName}`
    )
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

  renderFilterable() {
    return (
      <FilterableList
        onSelect={::this.onSelect}
        onSelectedClick={::this.onSelectedClick}
        items={this.getItems()}
        selected={this.getSelectedItems()}
        filter={this.filter}
        sort={this.sort}
        renderNotFound={this.renderNotFound}
        renderEmptyItems={this.renderEmptyItems}>
        <button onClick={::this.onInviteClick}>Invite a new person to your team</button>
      </FilterableList>
    )
  }

  render() {
    return (
      <div>
        {this.props.users ? this.renderFilterable() : null}
      </div>
    )
  }
}
