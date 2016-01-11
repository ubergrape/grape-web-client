import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../redux'
import {searchInputSelector} from '../../selectors'
import store from '../../store'
import actionNames from './actionNames'
// Temporary until a new input is implemented here.
import SearchInput from '../input/Input'

const ConnectedSearchInput = connect(
  searchInputSelector,
  mapActionsToProps(actionNames)
)(SearchInput)

export default class SearchInputProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedSearchInput />
      </Provider>
    )
  }
}
