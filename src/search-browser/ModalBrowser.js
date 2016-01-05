import React, {Component, PropTypes} from 'react'
import Modal from 'react-overlays/lib/Modal'

import {useSheet} from 'grape-web/lib/jss'
import Browser from './Browser'
import style from './modalStyle'

// Those methods will lead to ModalBrowser being removed from tree,
// however the Modal component needs to get show: false
const proxiMethodsToHideModal = [
  'onHide',
  'onAbort',
  'onSelectItem',
  'onAddIntegration'
]

@useSheet(style)
export default class ModalBrowser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onAbort: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {show: true}
    this.proxyCallbacksMap = proxiMethodsToHideModal.reduce((map, method) => {
      map[method] = this.proxyCallback.bind(this, method)
      return map
    }, {})
  }

  onHideModal() {
    this.setState({show: false})
  }

  proxyCallback(method, ...args) {
    this.setState({show: false}, () => {
      this.props[method](...args)
    })
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <Modal
        show={this.state.show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onHide={::this.onHideModal}>
        <Browser
          {...this.props}
          className={classes.browser}
          {...this.proxyCallbacksMap} />
      </Modal>
    )
  }
}
