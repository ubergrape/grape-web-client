import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import omit from 'lodash/object/omit'

import {mapActionsToProps} from '../../redux'
import {searchBrowserSelector} from '../../selectors'
import getStore from '../../store'
import actions from '../../boundActions'
import SearchBrowser from '../../components/search-browser/SearchBrowser'
import SearchBrowserModal from '../../components/search-browser/SearchBrowserModal'

const {createSearchBrowserState, resetSearchBrowserState} = actions

const propsMap = mapActionsToProps({
  focusSearchBrowserResult: 'onFocusResult',
  selectSearchBrowserResult: 'onSelectResult',
  focusSearchBrowserAction: 'onFocusAction',
  blurSearchBrowserAction: 'onBlurAction',
  execSearchBrowserAction: 'onExecAction',
  focusSearchBrowserActions: 'onFocusActions',
  changeSearchBrowserInput: 'onChangeInput',
  clearSearchBrowserInput: 'onClearInput',
  focusSearchBrowserService: 'onFocusService',
  addSearchBrowserService: 'onAddService',
  showSearchBrowserResults: 'onShowResults'
})

const ConnectedSearchBrowser = connect(searchBrowserSelector, propsMap)(SearchBrowser)

const ConnectedSearchBrowserModal = connect(searchBrowserSelector, propsMap)(SearchBrowserModal)

export default class SearchBrowserProvider extends Component {
  static propTypes = {
    modal: PropTypes.bool
  }

  static defaultProps = {
    modal: true
  }

  constructor(props) {
    super(props)
    createSearchBrowserState(omit(props, 'modal'))
  }

  componentWillReceiveProps(nextProps) {
    createSearchBrowserState(omit(nextProps, 'modal'))
  }

  componentWillUnmount() {
    resetSearchBrowserState()
  }

  render() {
    return (
      <Provider store={getStore()}>
        {this.props.modal ? <ConnectedSearchBrowserModal /> : <ConnectedSearchBrowser />}
      </Provider>
    )
  }
}
