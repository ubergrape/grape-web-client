import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from 'react-dropzone'
import { bigger } from 'grape-theme/dist/fonts'
import IconButton from 'grape-web/lib/components/icon-button'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { iconSize, buttonSize } from './constants'

import { maxSize as maxFileSize } from '../file-upload'
import { Beacon } from '../intro'

const AttachmentButton = props => {
  const {
    classes,
    isPostingLimited,
    onDropAccepted,
    onDropRejected,
    onOpenFileDialog,
  } = props

  // Upload click will be handled using public API.
  if (onOpenFileDialog) {
    return (
      <IconButton
        className={classes.button}
        onClick={onOpenFileDialog}
        disabled={isPostingLimited}
      >
        <Icon className={classes.contolIcon} name="paperclip" />
      </IconButton>
    )
  }

  return (
    <Dropzone
      className={classes.dropzone}
      maxSize={maxFileSize}
      disableClick={isPostingLimited}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
    >
      <IconButton
        className={classes.button}
        onClick={onOpenFileDialog}
        disabled={isPostingLimited}
      >
        <Icon className={classes.contolIcon} name="paperclip" />
      </IconButton>
    </Dropzone>
  )
}

class Controls extends PureComponent {
  static propTypes = {
    showBrowser: PropTypes.oneOf([
      false,
      'emoji',
      'emojiSuggest',
      'user',
      'search',
    ]).isRequired,
    classes: PropTypes.object.isRequired,
    isPostingLimited: PropTypes.bool,
    onUpload: PropTypes.func.isRequired,
    onShowEmojiBrowser: PropTypes.func.isRequired,
    onShowSearchBrowser: PropTypes.func.isRequired,
    onHideBrowser: PropTypes.func.isRequired,
    onRejectFiles: PropTypes.func.isRequired,
    onOpenFileDialog: PropTypes.func,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    isPostingLimited: false,
    onOpenFileDialog: undefined,
    permissions: {},
  }

  onDropAccepted = files => {
    this.props.onUpload({ files })
  }

  onDropRejected = files => {
    this.props.onRejectFiles({ files })
  }

  onToggleEmojiBrowser = e => {
    e.preventDefault()
    e.stopPropagation()
    if (this.props.showBrowser !== 'emoji') this.props.onShowEmojiBrowser()
    else this.props.onHideBrowser()
  }

  onShowSearchBrowser = e => {
    e.preventDefault()
    this.props.onShowSearchBrowser()
  }

  render() {
    const {
      classes,
      isPostingLimited,
      onOpenFileDialog,
      permissions,
    } = this.props
    return (
      <div className={classes.controls}>
        {!isPostingLimited && (
          <div>
            <AttachmentButton
              classes={classes}
              onOpenFileDialog={onOpenFileDialog}
              onDropAccepted={this.onDropAccepted}
              onDropRejected={this.onDropRejected}
            />
            <IconButton
              className={classes.button}
              onClick={this.onToggleEmojiBrowser}
            >
              <Icon className={classes.contolIcon} name="smileOpen" />
            </IconButton>
            {permissions.canUseGrapesearch && (
              <IconButton
                className={classes.button}
                onClick={this.onShowSearchBrowser}
              >
                <Icon className={classes.contolIcon} name="windowSearch" />
              </IconButton>
            )}
            <Beacon id="searchBrowser" placement="top" shift={{ left: -15 }} />
          </div>
        )}
      </div>
    )
  }
}

export default injectSheet(({ palette }) => ({
  controls: {
    extend: bigger,
    flexShrink: 0,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    '&:hover': {
      isolate: false,
      color: palette.secondary.A200,
    },
  },
  contolIcon: {
    width: iconSize,
    height: iconSize,
    cursor: 'pointer',
  },
  dropzone: {},
}))(Controls)
