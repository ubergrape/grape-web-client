import React, {Component} from 'react'
import Modal from 'react-overlays/lib/Modal'
import noop from 'lodash/utility/noop'

import style from './style'
import {useSheet} from '../jss'

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
export default class Dialog extends Component {
  static defaultProps = {
    onHide: noop,
    title: undefined,
    show: undefined
  }
  render() {
    let {classes} = this.props.sheet
    return (
      <Modal
        show={this.props.show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onHide={this.props.onHide}>
        <div className={classes.content}>
          <header className={classes.header}>
            <h2 className={classes.title}>{this.props.title}</h2>
            <button className={classes.close} onClick={this.props.onHide}></button>
          </header>
          <div className={classes.body}>
            {this.props.children}
          </div>
        </div>
      </Modal>
    )
  }
}