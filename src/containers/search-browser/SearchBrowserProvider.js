import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../redux'
import {searchBrowserSelector} from '../../selectors'
import getStore from '../../store'
import SearchBrowser from '../../components/search-browser/SearchBrowser'
import SearchBrowserModal from '../../components/search-browser/SearchBrowserModal'

const getProps = mapActionsToProps({
  focusSearchBrowserResult: 'onFocusResult',
  selectSearchBrowserResult: 'onSelectResult',
  focusSearchBrowserAction: 'onFocusAction',
  blurSearchBrowserAction: 'onBlurAction',
  execSearchBrowserAction: 'onExecAction',
  focusSearchBrowserActions: 'onFocusActions',
  updateSearchBrowserInput: 'onUpdateInput',
  showSearchBrowserServices: 'onShowServices',
  focusSearchBrowserService: 'onFocusService',
  addSearchBrowserFilter: 'onAddFilter',
  showSearchBrowserResults: 'onShowResults',
  resetSearchBrowserState: 'onReset',
  updateSearchBrowserResults: 'onUpdateResults'
})

const ConnectedSearchBrowser = connect(searchBrowserSelector, getProps)(SearchBrowser)

const ConnectedSearchBrowserModal = connect(searchBrowserSelector, getProps)(SearchBrowserModal)

export default class SearchBrowserProvider extends Component {
  static propTypes = {
    modal: PropTypes.bool
  }

  static defaultProps = {
    modal: true
  }

  render() {
    const {modal, ...rest} = this.props
    const Browser = modal ? ConnectedSearchBrowserModal : ConnectedSearchBrowser
    return (
      <Provider store={getStore()}>
        <Browser {...rest} />
      </Provider>
    )
  }
}
