import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {favouriteSelector as selector} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import Favourite from './Favourite'

const ConnectedFavourite = connect(
  selector,
  mapActionsToProps(actionNames)
)(Favourite)

export default class FavouriteProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedFavourite />
      </Provider>
    )
  }
}
