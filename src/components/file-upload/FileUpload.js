import React, {PureComponent, PropTypes} from 'react'
import Dropzone from 'react-dropzone'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'

import DropOverlay from './DropOverlay'
import Progress from './Progress'
import FileTooBig from './FileTooBig'
import {getFilesFromClipboard, findAcceptedAndRejected} from './utils'
import {maxSize} from './constants'

export default class FileUpload extends PureComponent {
  static propTypes = {
    dropZoneStyle: PropTypes.object.isRequired,
    onUpload: PropTypes.func.isRequired,
    uploading: PropTypes.array.isRequired
  }

  static defaultProps = {
    // We pass nothing to avoid default styles.
    dropZoneStyle: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      isDragging: false
    }
  }

  onDragEnter = () => {
    this.setState({isDragging: true})
  }

  onDragDone = () => {
    this.setState({isDragging: false})
  }

  onAccept = (files) => {
    this.props.onUpload({files})
  }

  onReject = (files) => {
    this.props.onReject({message: <FileTooBig files={files} />})
  }

  onPaste = ({clipboardData}) => {
    getFilesFromClipboard(clipboardData)
      .then(findAcceptedAndRejected)
      .then(({accepted, rejected}) => {
        if (accepted.length) this.onAccept(accepted)
        if (rejected.length) this.onReject(rejected)
      })
  }

  render() {
    const {
      children,
      dropZoneStyle,
      uploading,
      onNotify
    } = this.props
    const {isDragging} = this.state

    console.log('uploading', uploading)

    return (
      <Dropzone
        disableClick
        disablePreview
        style={dropZoneStyle}
        onDrop={this.onDragDone}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragDone}
        onDropAccepted={this.onAccept}
        onDropRejected={this.onReject}
        maxSize={maxSize}>
        {children}
        {isDragging && <DropOverlay />}
        <GlobalEvent event="paste" handler={this.onPaste} />
        {uploading.map(upload => (
          <Progress {...upload} onNotify={onNotify} key={upload.id} />)
        )}
      </Dropzone>
    )
  }
}
