import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {favoriteSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import Favorite from './Favorite'

const ConnectedFavorite = connect(
  selector,
  mapActionsToProps(actionNames)
)(Favorite)

export default class FavoriteProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedFavorite />
      </Provider>
    )
  }
}
