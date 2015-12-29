import React, {Component, PropTypes} from 'react'
import Modal from 'react-overlays/lib/Modal'

import {useSheet} from 'grape-web/lib/jss'
import Browser from './Browser'
import style from './modalStyle'

@useSheet(style)
export default class ModalBrowser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onAbort: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {show: true}
  }

  onHideModal() {
    this.setState({show: false})
  }

  onAbortBrowser(...args) {
    this.setState({show: false})
    this.props.onAbort(args)
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
          onAbort={::this.onAbortBrowser} />
      </Modal>
    )
  }
}
