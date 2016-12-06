import React, {PureComponent, PropTypes} from 'react'
import Modal from 'react-overlays/lib/Modal'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@injectSheet(styles)
export default class Dialog extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    sheet: PropTypes.object.isRequired,
    title: PropTypes.string
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
