import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'react-a11y-dialog'

class A11yDialog extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    classNames: PropTypes.object.isRequired,
    children: PropTypes.node,
    closeButtonLabel: PropTypes.string,
  }

  static defaultProps = {
    closeButtonLabel: 'Close this dialog window',
    children: null,
  }

  componentDidMount() {
    const dialog = document.getElementById(this.props.id)

    const callback = mutationsList => {
      mutationsList.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'aria-hidden' &&
          mutation.target.getAttribute('aria-hidden')
        ) {
          this.props.onHide()
        }
      })
    }

    const observer = new MutationObserver(callback)
    observer.observe(dialog, { attributes: true })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) this.dialog.show()
    else this.dialog.hide()
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
