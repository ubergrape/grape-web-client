import React, {Component} from 'react'

import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class FileBrowser extends Component {
  render() {
    const {classes} = this.props.sheet
    return (
      <section className={classes.file}>
        <div className={classes.leftColumn}>
          {this.renderPreview()}
        </div>
        <div className={classes.rightColumn}>
          <h2 className={classes.name}>{this.props.name}</h2>
          <p className={classes.meta}>{this.props.time}</p>
          <p className={classes.channel}>Shared in <b>{this.props.channelName}</b></p>
        </div>
      </section>
    )
  }

  renderPreview() {
    const {classes} = this.props.sheet
    const {thumbnailUrl} = this.props
    let className
    let style

    if (thumbnailUrl) {
      className = classes.thumbnail
      style = {
        backgroundImage: `url(${thumbnailUrl})`
      }
    }
    else {
      className = classes.icon
      style = {
      }
    }

    return <div className={className} style={style}></div>
  }
}
