import React, {Component, PropTypes} from 'react'
import Modal from 'react-overlays/lib/Modal'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@useSheet(style)
export default class Dialog extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {classes} = this.props.sheet
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
