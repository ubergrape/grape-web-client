import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Normalize from 'grape-web/lib/components/normalize'
import Modal from 'react-overlays/lib/Modal'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'grape-web/lib/components/icon-button'
import { black, white } from 'grape-theme/dist/base-colors'
import { small, biggest } from 'grape-theme/dist/fonts'
import { borderRadius } from 'grape-theme/dist/sizes'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import Icon from 'grape-web/lib/svg-icons/Icon'

import { zIndex } from '../../utils/z-index'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@injectSheet({
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modal: {
    composes: '$overlay',
    zIndex: zIndex('dialog'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  backdrop: {
    composes: '$overlay',
    backgroundColor: black,
    opacity: 0.3,
    zIndex: zIndex('below'),
  },
  content: {
    minWidth: 525,
    borderRadius: borderRadius.big,
    boxShadow: '0px 4px 10px -1px rgba(33,32,34,0.5)',
    overflow: 'hidden',
    outline: 0,
  },
  header: {
    display: 'flex',
    background: white,
    height: 50,
  },
  close: {
    isolate: false,
    fontSize: small.fontSize,
    opacity: 0.5,
    flex: 1,
    '&:hover': {
      isolate: false,
      opacity: 1,
    },
  },
  title: {
    extend: [biggest, ellipsis],
    alignSelf: 'center',
    paddingLeft: 20,
  },
  body: {
    display: 'block',
    background: white,
  },
})
export default class Dialog extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    sheet: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  }

  render() {
    const {
      sheet: { classes },
      show,
      onHide,
      title,
      children,
    } = this.props

    return (
      <Modal
        show={show}
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onHide={onHide}
        autoFocus={false}
      >
        <Normalize className={classes.content}>
          <header className={classes.header}>
            <h2 className={classes.title}>{title}</h2>
            <IconButton className={classes.close} onClick={onHide}>
              <Icon name="close" />
            </IconButton>
          </header>
          <div className={classes.body}>{children}</div>
        </Normalize>
      </Modal>
    )
  }
}
