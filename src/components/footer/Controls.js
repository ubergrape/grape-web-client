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
        className={`${classes.attachment}
          ${disabled ? classes.attachmentDisabled : classes.attachmentEnabled}`}
        onClick={onOpenFileDialog}
      />
    )
  }

  return (
    <Dropzone
      className={`${classes.attachment}
        ${disabled ? classes.attachmentDisabled : classes.attachmentEnabled}`}
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
      fontSize: 'inherit'
    },
    attachmentEnabled: {
      extend: buttonIcon('paperclip', iconOptions),
      padding: controlSpacing
    },
    attachmentDisabled: {
      extend: buttonIcon('paperclip', iconOptionsDisabled),
      padding: controlSpacing
    },
    emoji: {
      fontSize: 'inherit'
    },
    emojiEnabled: {
      extend: buttonIcon('smileOpen', iconOptions),
      padding: controlSpacing
    },
    emojiDisabled: {
      extend: buttonIcon('smileOpen', iconOptionsDisabled),
      padding: controlSpacing
    },
    search: {
      fontSize: 'inherit'
    },
    searchEnabled: {
      extend: buttonIcon('windowSearch', iconOptions),
      padding: controlSpacing
    },
    searchDisabled: {
      extend: buttonIcon('windowSearch', iconOptionsDisabled),
      padding: controlSpacing
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
          className={`${classes.emoji}
            ${disabled ? classes.emojiDisabled : classes.emojiEnabled}`}
          onClick={this.onToggleEmojiBrowser} disabled={disabled}
        />
        <button
          className={`${classes.search}
            ${disabled ? classes.searchDisabled : classes.searchEnabled}`}
          onClick={this.onShowSearchBrowser} disabled={disabled}
        />
        <Beacon id="searchBrowser" placement="top" shift={{left: -15}} />
      </div>
    )
  }
}
