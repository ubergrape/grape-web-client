import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from 'react-dropzone'
import {bigger} from 'grape-theme/dist/fonts'
import IconButton from 'material-ui/IconButton'
import Icon from 'grape-web/lib/svg-icons/Icon'

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
      <IconButton
        className={classes.attachment}
        onClick={onOpenFileDialog}
        disabled={disabled}
      >
        <Icon name="paperclip" />
      </IconButton>
    )
  }

  return (
    <Dropzone
      className={classes.attachment}
      maxSize={maxFileSize}
      disableClick={disabled}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
    >
      <IconButton
        className={classes.attachment}
        onClick={onOpenFileDialog}
        disabled={disabled}
      >
        <Icon name="paperclip" />
      </IconButton>
    </Dropzone>
  )
}

@injectSheet(({palette}) => {
  const iconOptions = {
    color: palette.text.primary,
    hoverColor: palette.secondary.A200,
    iconOnly: true
  }

  const iconOptionsDisabled = {
    color: palette.grey[300],
    iconOnly: true,
    cursor: 'default',
    pointerEvents: 'none'
  }

  return {
    controls: {
      extend: bigger,
      flexShrink: 0
    },
    attachment: ({disabled}) => ({
      ...buttonIcon('paperclip', disabled ? iconOptionsDisabled : iconOptions),
      padding: controlSpacing
    }),
    emoji: ({disabled}) => ({
      ...buttonIcon('smileOpen', disabled ? iconOptionsDisabled : iconOptions),
      padding: controlSpacing
    }),
    search: ({disabled}) => ({
      ...buttonIcon('windowSearch', disabled ? iconOptionsDisabled : iconOptions),
      padding: controlSpacing
    })
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
        <IconButton
          className={classes.emoji}
          onClick={this.onToggleEmojiBrowser}
          disabled={disabled}
        >
          <Icon name="smileOpen" />
        </IconButton>
        <IconButton
          className={classes.search}
          onClick={this.onShowSearchBrowser}
          disabled={disabled}
        >
          <Icon name="windowSearch" />
        </IconButton>
        <Beacon id="searchBrowser" placement="top" shift={{left: -15}} />
      </div>
    )
  }
}
