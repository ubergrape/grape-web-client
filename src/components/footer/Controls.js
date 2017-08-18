import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from 'react-dropzone'

import {maxSize as maxFileSize} from '../file-upload'
import {Beacon} from '../intro'
import {styles} from './controlsTheme'

const AttachmentButton = (props) => {
  const {
    classes, disabled, onDropAccepted, onDropRejected, onOpenFileDialog
  } = props

  // Upload click will be handled using public API.
  if (onOpenFileDialog) {
    return <span className={classes.attachment} onClick={onOpenFileDialog} />
  }

  return (
    <Dropzone
      className={classes.attachment}
      maxSize={maxFileSize}
      disableClick={disabled}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
    />
  )
}

@injectSheet(styles)
export default class Controls extends PureComponent {
  static propTypes = {
    showBrowser: PropTypes.oneOf([false, 'emoji', 'emojiSuggest', 'user', 'search']).isRequired,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    onUpload: PropTypes.func.isRequired,
    onShowEmojiBrowser: PropTypes.func.isRequired,
    onShowSearchBrowser: PropTypes.func.isRequired,
    onHideBrowser: PropTypes.func.isRequired,
    onRejectFiles: PropTypes.func.isRequired,
    onOpenFileDialog: PropTypes.func
  }

  static defaultProps = {
    disabled: false,
    onOpenFileDialog: undefined
  }

  onDropAccepted = (files) => {
    this.props.onUpload({files})
  }

  onDropRejected = (files) => {
    this.props.onRejectFiles({files})
  }

  onToggleEmojiBrowser = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.props.showBrowser !== 'emoji') this.props.onShowEmojiBrowser()
    else this.props.onHideBrowser()
  }

  onShowSearchBrowser = (e) => {
    e.preventDefault()
    this.props.onShowSearchBrowser()
  }

  render() {
    const {classes, disabled, onOpenFileDialog} = this.props
    return (
      <div className={classes.controls}>
        <AttachmentButton
          classes={classes}
          disabled={disabled}
          onOpenFileDialog={onOpenFileDialog}
          onDropAccepted={this.onDropAccepted}
          onDropRejected={this.onDropRejected}
        />
        <button className={classes.emoji} onClick={this.onToggleEmojiBrowser} disabled={disabled} />
        <button className={classes.search} onClick={this.onShowSearchBrowser} disabled={disabled} />
        <Beacon id="searchBrowser" placement="top" shift={{left: -15}} />
      </div>
    )
  }
}
