import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../redux'
import {searchBrowserSelector} from '../../selectors'
import store from '../../store'
import actionNames from './actionNames'
import SearchBrowserModal from './SearchBrowserModal'
import {createSearchBrowserState, resetSearchBrowserState} from '../../boundActions'

const ConnectedSearchBrowserModal = connect(
  searchBrowserSelector,
  mapActionsToProps(actionNames)
)(SearchBrowserModal)

export default class SearchBrowserModalProvider extends Component {
  constructor(props) {
    super(props)
    createSearchBrowserState(props)
  }

  componentWillReceiveProps(nextProps) {
    createSearchBrowserState(nextProps)
  }

  componentWillUnmount() {
    resetSearchBrowserState()
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedSearchBrowserModal />
      </Provider>
    )
  }
}
