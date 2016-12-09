import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dropzone from 'react-dropzone'

import {styles} from './controlsTheme'

@injectSheet(styles)
export default class Controls extends PureComponent {
  onSelectFiles = (files) => {
    this.props.onUpload({files})
  }

  onShowEmojiBrowser = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onShowEmojiBrowser()
  }

  onShowGrapeBrowser = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onShowGrapeBrowser()
  }

  render() {
    const {sheet: {classes}} = this.props
    return (
      <div className={classes.controls}>
        <Dropzone
          className={classes.attachment}
          onDropAccepted={this.onSelectFiles} />
        <button className={classes.emoji} onClick={this.onShowEmojiBrowser} />
        <button className={classes.search} onClick={this.onShowGrapeBrowser} />
      </div>
    )
  }
}
