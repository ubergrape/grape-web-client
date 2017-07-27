import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Modal from 'react-overlays/lib/Modal'
import injectSheet from 'grape-web/lib/jss'
import Button from 'material-ui/Button'

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
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired
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
        onHide={onHide}
      >
        <div className={classes.content}>
          <header className={classes.header}>
            <h2 className={classes.title}>{title}</h2>
            <Button className={classes.close} onClick={onHide}>×</Button>
          </header>
          <div className={classes.body}>
            {children}
          </div>
        </div>
      </Modal>
    )
  }
}
