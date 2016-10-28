import React, {Component, PropTypes} from 'react'
import Modal from 'react-overlays/lib/Modal'
import injectSheet from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './theme'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@injectSheet(styles)
export default class Dialog extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    sheet: PropTypes.object.isRequired,
    title: PropTypes.string
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      sheet: {classes},
      show, onHide, title, children
    } = this.props

    return (
      <Modal
        show={show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onHide={onHide}>
        <div className={classes.content}>
          <header className={classes.header}>
            <h2 className={classes.title}>{title}</h2>
            <button className={classes.close} onClick={onHide}></button>
          </header>
          <div className={classes.body}>
            {children}
          </div>
        </div>
      </Modal>
    )
  }
}
