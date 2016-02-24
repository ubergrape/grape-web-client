import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {userProfileSelector} from '../selectors'
import actionNames from './actionNames'
import UserProfile from './UserProfile'

const ConnectedUserProfile = connect(
  userProfileSelector,
  mapActionsToProps(actionNames)
)(UserProfile)

export default function init(store) {
  return class UserProfileProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedUserProfile />
        </Provider>
      )
    }
  }
}
