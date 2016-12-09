import React, {PureComponent, PropTypes} from 'react'
import Dropzone from 'react-dropzone'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'

import DropOverlay from './DropOverlay'
import {getFilesFromClipboard} from './utils'

export default class FileUpload extends PureComponent {
  static propTypes = {
    dropZoneStyle: PropTypes.object.isRequired,
    onUpload: PropTypes.func.isRequired
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

  onDrop = () => {
    this.setState({isDragging: false})
  }

  onDropAccepted = (files) => {
    this.props.onUpload({files})
  }

  onPaste = ({clipboardData}) => {
    getFilesFromClipboard(clipboardData)
      .then(files => {
        if (files.length) this.props.onUpload({files})
      })
  }

  render() {
    const {
      children,
      dropZoneStyle
    } = this.props
    const {isDragging} = this.state

    return (
      <Dropzone
        disableClick
        disablePreview
        style={dropZoneStyle}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDropAccepted={this.onDropAccepted}>
        {children}
        {isDragging && <DropOverlay />}
        <GlobalEvent event="paste" handler={this.onPaste} />
      </Dropzone>
    )
  }
}
