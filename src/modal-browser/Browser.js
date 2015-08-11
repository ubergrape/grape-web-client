import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import noop from 'lodash/utility/noop'

import Modal from 'react-overlays/lib/Modal'
import style from './style'
import {useSheet} from '../jss'

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
export default class ModalBrowser extends Component {
  static defaultProps = {
    onAbort: noop,
    browser: undefined
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      show: true
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(newProps) {
    this.setState(newProps)
  }

  render() {
    let {classes} = this.props.sheet
    let Browser = this.props.browser

    return (
      <Modal
        show={this.state.show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onHide={::this.onHide}>
        <Browser
          {...this.state}
          className={classes.browser} />
      </Modal>
    )
  }

  onHide() {
    this.setState({show: false})
    this.props.onAbort({reason: 'modalHide'})
  }
}
