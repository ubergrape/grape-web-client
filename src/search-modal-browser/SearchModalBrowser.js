import React, {Component} from 'react'

import ModalBrowser from '../modal-browser/Browser'
import Browser from '../search-browser/Browser'

export default class SearchModalBrowser extends Component {
  render() {
    return <ModalBrowser {...this.props} browser={Browser} />
  }
}
