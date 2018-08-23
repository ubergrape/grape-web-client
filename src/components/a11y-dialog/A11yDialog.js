import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Dialog from 'react-a11y-dialog'
import injectSheet from 'grape-web/lib/jss'

const styles = {
  base: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
    '&[aria-hidden="true"]': {
      display: 'none',
    },
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  element: {
    position: 'absolute',
  },
}

class A11yDialog extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) this.dialog.show()
  }

  componentDidUpdate() {
    if (this.dialog.shown) this.props.onHide()
  }

  onDialogRef = dialog => {
    this.dialog = dialog
  }

  render() {
    const {
      id,
      title,
      sheet: { classes },
    } = this.props
    return (
      <Dialog
        classNames={classes}
        id={id}
        title={title}
        appRoot="#grape-client"
        dialogRef={this.onDialogRef}
      >
        Hello world
      </Dialog>
    )
  }
}

export default injectSheet(styles)(A11yDialog)
