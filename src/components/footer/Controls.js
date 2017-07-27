import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from '@ubergrape/react-dropzone'

import {maxSize as maxFileSize} from '../file-upload'
import {Beacon} from '../intro'
import {styles} from './controlsTheme'

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
    onRejectFiles: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false
  }

  onSelectFiles = (files) => {
    this.props.onUpload({files})
  }

  onRejectFiles = (files) => {
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
    const {classes, disabled} = this.props
    return (
      <div className={classes.controls}>
        <Dropzone
          className={classes.attachment}
          onDropAccepted={this.onSelectFiles}
          onDropRejected={this.onRejectFiles}
          maxSize={maxFileSize}
          disableClick={disabled}
        />
        <button className={classes.emoji} onClick={this.onToggleEmojiBrowser} disabled={disabled} />
        <button className={classes.search} onClick={this.onShowSearchBrowser} disabled={disabled} />
        <Beacon id="searchBrowser" placement="top" shift={{left: -15}} />
      </div>
    )
  }
}
