import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import {useSheet} from 'grape-web/lib/jss'
import * as icons from 'grape-web/lib/svg-icons'
import style from './style'
const dateFormat = 'MMM Do, h:mm a'

@useSheet(style)
export default class SharedFile extends Component {
  static defaultProps = {
    id: undefined,
    author: undefined,
    time: undefined,
    channelName: undefined,
    channelType: undefined,
    name: undefined,
    thumbnailUrl: undefined,
    iconType: undefined,
    url: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {classes} = this.props.sheet
    return (
      <section
        className={classes.sharedFile}
        onClick={::this.onOpen}>
        <div className={classes.leftColumn}>
          {this.renderPreview()}
        </div>
        <div className={classes.rightColumn}>
          <h2 className={classes.name}>{this.props.name}</h2>
          <p className={classes.meta}>{tz(this.props.time).format(dateFormat)}</p>
          <p className={classes.meta}>{this.props.author}</p>
          <p className={classes.meta}>
            Shared {this.props.channelType === 'room' ? 'in' : 'with'} {this.props.channelName}
          </p>
        </div>
      </section>
    )
  }

  renderPreview() {
    const {classes} = this.props.sheet
    const {thumbnailUrl} = this.props
    let className
    let iconStyle

    if (thumbnailUrl) {
      className = classes.thumbnail
      iconStyle = {
        backgroundImage: `url(${thumbnailUrl})`
      }
    }
    else {
      className = classes.icon
      const svg = icons[this.props.iconType] || icons.document
      iconStyle = {
        backgroundImage: `url('data:image/svg+xml;utf8,${svg}')`
      }
    }

    return <div className={className} style={iconStyle}></div>
  }

  onOpen() {
    window.open(this.props.url)
  }
}
