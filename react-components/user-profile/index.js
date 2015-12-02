import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {userProfileSelector} from '../selectors'
import actions from './actions'
import UserProfile from './UserProfile'

const ConnectedUserProfile = connect(
  userProfileSelector,
  mapActionsToProps(actions)
)(UserProfile)

export default function init(store) {
  return class UserProfileProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedUserProfile />
        </Provider>
      )
    }
  }
}
