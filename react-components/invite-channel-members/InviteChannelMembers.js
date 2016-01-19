import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import FilterableList from '../filterable-list/FilterableList'

@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  onClick(user) {
    console.log('onClick', user)
    this.props.addToInviteList(user)
  }

  onSelectedClick(user) {
    console.log('onSelectedClick', user)
    this.props.removeFromInviteList(user)
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

  render() {
    console.log(this.props)
    return (
      <div>
        <FilterableList
          onClick={::this.onClick}
          onSelectedClick={::this.onSelectedClick}
          items={this.props.users}
          selected={this.props.invited}
          filter={this.filter}
          sort={this.sort} />
      </div>
    )
  }
}
