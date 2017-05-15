import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Modal from 'react-overlays/lib/Modal'

import injectSheet from 'grape-web/lib/jss'
import SearchBrowser from './SearchBrowser'
import style from './searchBrowserModalStyle'

// Those methods will lead to ModalBrowser being removed from tree,
// however the Modal component needs to get show: false
const proxiMethodsToHideModal = [
  'onHide',
  'onAbort',
  'onSelectItem',
  'onAddIntegration'
]

@injectSheet(style)
export default class SearchBrowserModal extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onAbort: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {show: true}
    this.callbacks = proxiMethodsToHideModal.reduce((map, method) => {
      map[method] = this.hideAndCallMethod.bind(this, method)
      return map
    }, {})
  }

  onHideModal() {
    this.hideAndCallMethod('onAbort', {reason: 'esc'})
  }

  hideAndCallMethod(method, ...args) {
    this.setState({show: false}, () => {
      this.props[method](...args)
    })
  }

  render() {
    const {sheet: {classes}, ...rest} = this.props
    return (
      <Modal
        show={this.state.show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onBackdropClick={::this.onHideModal}>
        <SearchBrowser
          {...rest}
          {...this.callbacks}
          className={classes.browser}
          onAbort={::this.onHideModal} />
      </Modal>
    )
  }
}
