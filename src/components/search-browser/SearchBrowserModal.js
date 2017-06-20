import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Modal from 'react-overlays/lib/Modal'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'

import SearchBrowser from './SearchBrowser'

@injectSheet({
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1000,
    top: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
  },
  browser: {
    position: 'relative',
    width: '80%',
    top: '10%',
    alignSelf: 'center',
    maxWidth: 800,
    minWidth: 200
  }
})
export default class SearchBrowserModal extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onAbort: PropTypes.func,
    onReset: PropTypes.func
  }

  static defaultProps = {
    onAbort: noop,
    onReset: noop
  }

  onAbort = () => {
    const {onAbort, onReset} = this.props
    onAbort({reason: 'esc'})
    onReset()
  }

  render() {
    const {classes, ...rest} = this.props
    return (
      <Modal
        show
        className={classes.modal}
        backdropClassName={classes.backdrop}
        onBackdropClick={this.onAbort}
      >
        <SearchBrowser
          {...rest}
          className={classes.browser}
          onAbort={this.onAbort}
        />
      </Modal>
    )
  }
}
