import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from 'react-dropzone'
import {bigger} from 'grape-theme/dist/fonts'
import grey from 'material-ui/colors/grey'

import {maxSize as maxFileSize} from '../file-upload'
import {Beacon} from '../intro'
import buttonIcon from '../button/icon'
import {controlSpacing} from './constants'

const AttachmentButton = (props) => {
  const {
    classes, disabled, onDropAccepted, onDropRejected, onOpenFileDialog
  } = props

  // Upload click will be handled using public API.
  if (onOpenFileDialog) {
    return (
      <span
        className={disabled ? classes.attachmentDisabled : classes.attachment}
        onClick={onOpenFileDialog}
      />
    )
  }

  return (
    <Dropzone
      className={disabled ? classes.attachmentDisabled : classes.attachment}
      maxSize={maxFileSize}
      disableClick={disabled}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
    />
  )
}

@injectSheet(({palette}) => {
  const iconOptions = {
    color: palette.text.primary,
    hoverColor: palette.secondary.A200,
    iconOnly: true
  }

  const iconOptionsDisabled = {
    color: grey[300],
    iconOnly: true
  }

  return {
    controls: {
      extend: bigger,
      flexShrink: 0
    },
    attachment: {
      extend: buttonIcon('paperclip', iconOptions),
      padding: controlSpacing,
      fontSize: 'inherit'
    },
    attachmentDisabled: {
      extend: buttonIcon('paperclip', iconOptionsDisabled),
      padding: controlSpacing,
      fontSize: 'inherit'
    },
    emoji: {
      extend: buttonIcon('smileOpen', iconOptions),
      padding: controlSpacing,
      fontSize: 'inherit'
    },
    emojiDisabled: {
      extend: buttonIcon('smileOpen', iconOptionsDisabled),
      padding: controlSpacing,
      fontSize: 'inherit'
    },
    search: {
      extend: buttonIcon('windowSearch', iconOptions),
      padding: controlSpacing,
      fontSize: 'inherit'
    },
    searchDisabled: {
      extend: buttonIcon('windowSearch', iconOptionsDisabled),
      padding: controlSpacing,
      fontSize: 'inherit'
    }
  }
})
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
        <button
          className={
            disabled ? classes.emojiDisabled : classes.emoji
          }
          onClick={this.onToggleEmojiBrowser} disabled={disabled}
        />
        <button
          className={
            disabled ? classes.searchDisabled : classes.search
          }
          onClick={this.onShowSearchBrowser} disabled={disabled}
        />
        <Beacon id="searchBrowser" placement="top" shift={{left: -15}} />
      </div>
    )
  }
}
