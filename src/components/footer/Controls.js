import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from 'react-dropzone'

import {maxSize as maxFileSize} from '../file-upload'
import {styles} from './controlsTheme'

@injectSheet(styles)
export default class Controls extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onUpload: PropTypes.func.isRequired,
    onShowEmojiBrowser: PropTypes.func.isRequired,
    onShowGrapeBrowser: PropTypes.func.isRequired,
    onRejectFiles: PropTypes.func.isRequired
  }

  onSelectFiles = (files) => {
    this.props.onUpload({files})
  }

  onRejectFiles = (files) => {
    this.props.onRejectFiles({files})
  }

  onShowEmojiBrowser = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onShowEmojiBrowser()
  }

  onShowGrapeBrowser = (e) => {
    e.preventDefault()
    this.props.onShowGrapeBrowser()
  }

  render() {
    const {sheet: {classes}} = this.props
    return (
      <div className={classes.controls}>
        <Dropzone
          className={classes.attachment}
          onDropAccepted={this.onSelectFiles}
          onDropRejected={this.onRejectFiles}
          maxSize={maxFileSize} />
        <button className={classes.emoji} onClick={this.onShowEmojiBrowser} />
        <button className={classes.search} onClick={this.onShowGrapeBrowser} />
      </div>
    )
  }
}
