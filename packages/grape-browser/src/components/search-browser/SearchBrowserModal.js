import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Modal from 'react-overlays/lib/Modal'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'
import Normalize from 'grape-web/lib/components/normalize'

import SearchBrowser from './SearchBrowser'

class SearchBrowserModal extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onAbort: PropTypes.func,
    onReset: PropTypes.func,
    goTo: PropTypes.func,
  }

  static defaultProps = {
    onAbort: noop,
    onReset: noop,
    goTo: noop,
  }

  onAbort = () => {
    const { onAbort, onReset } = this.props
    onAbort({ reason: 'esc' })
    onReset()
  }

  render() {
    const { classes, goTo, ...rest } = this.props
    return (
      <Modal
        show
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onBackdropClick={this.onAbort}
      >
        <Normalize className={classes.browserContainer}>
          <SearchBrowser
            {...rest}
            className={classes.browser}
            onAbort={this.onAbort}
            goTo={goTo}
          />
        </Normalize>
      </Modal>
    )
  }
}

export default injectSheet({
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 3001,
    top: 0,
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5,
  },
  browserContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  browser: {
    position: 'relative',
    width: '80%',
    top: '10%',
    alignSelf: 'center',
    maxWidth: 800,
    minWidth: 200,
  },
})(SearchBrowserModal)
