import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Dropzone from 'react-dropzone'
import GlobalEvent from 'grape-web/lib/components/global-event'

import DropOverlay from './DropOverlay'
import Notification from './Notification'
import { getFilesFromClipboard, findAcceptedAndRejected } from './utils'
import { maxSize } from './constants'

export default class FileUpload extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onUpload: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onNotify: PropTypes.func.isRequired,
    onHideNotification: PropTypes.func.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    uploads: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    disabled: false,
    // We pass nothing to avoid default styles.
    style: {},
    className: '',
  }

  state = { isDragging: false }

  onDragStart = e => {
    // Avoid uploads triggered by d&d of DOM elements. For e.g. anchors and images
    // are draggable by default.
    e.preventDefault()
  }

  onDragEnter = () => {
    this.setState({ isDragging: true })
  }

  onDragDone = () => {
    this.setState({ isDragging: false })
  }

  onAccept = files => {
    this.props.onUpload({ files })
  }

  onReject = files => {
    this.props.onReject({ files })
  }

  onPaste = ({ clipboardData }) => {
    getFilesFromClipboard(clipboardData)
      .then(findAcceptedAndRejected)
      .then(({ accepted, rejected }) => {
        if (accepted.length) this.onAccept(accepted)
        if (rejected.length) this.onReject(rejected)
      })
  }

  render() {
    const {
      disabled,
      children,
      uploads,
      onNotify,
      onHideNotification,
      style,
      className,
    } = this.props

    const { isDragging } = this.state

    return (
      <Dropzone
        disableClick
        disablePreview
        disabled={disabled}
        style={style}
        onDrop={this.onDragDone}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragDone}
        onDropAccepted={this.onAccept}
        onDropRejected={this.onReject}
        maxSize={maxSize}
        className={className}
        inputProps={{ style: { opacity: 0 }}}
      >
        {children}
        {isDragging && <DropOverlay />}
        <GlobalEvent event="paste" handler={this.onPaste} />
        <Notification
          uploads={uploads}
          onNotify={onNotify}
          onHideNotification={onHideNotification}
        />
      </Dropzone>
    )
  }
}
