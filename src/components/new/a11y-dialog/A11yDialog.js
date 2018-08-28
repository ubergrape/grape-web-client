import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Dialog from 'react-a11y-dialog'

class A11yDialog extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    classNames: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    closeButtonLabel: PropTypes.string,
  }

  static defaultProps = {
    closeButtonLabel: 'Close this dialog window',
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
    const { id, title, children, classNames, closeButtonLabel } = this.props
    return (
      <Dialog
        id={id}
        title={title}
        appRoot="#grape-client"
        dialogRef={this.onDialogRef}
        classNames={classNames}
        closeButtonLabel={closeButtonLabel}
      >
        {children}
      </Dialog>
    )
  }
}

export default A11yDialog
