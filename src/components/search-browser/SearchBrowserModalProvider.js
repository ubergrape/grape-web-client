import PropTypes from 'prop-types'
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
  static propTypes = {
    onLoadServices: PropTypes.func
  }

  constructor(props) {
    super(props)
    createSearchBrowserState(props)
  }

  componentDidMount() {
    // TODO move this when we port the whole client to redux.
    this.props.onLoadServices()
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
