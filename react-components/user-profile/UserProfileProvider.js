import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {userProfileSelector as selector} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import UserProfile from './UserProfile'

const ConnectedUserProfile = connect(
  selector,
  mapActionsToProps(actionNames)
)(UserProfile)

export default class UserProfileProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedUserProfile />
      </Provider>
    )
  }
}
