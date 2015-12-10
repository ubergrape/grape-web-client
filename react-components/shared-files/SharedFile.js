import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import {useSheet} from 'grape-web/lib/jss'
import * as icons from 'grape-web/lib/svg-icons/data'
import style from './sharedFileStyle'
const dateFormat = 'MMM Do, h:mm a'

@useSheet(style)
export default class SharedFile extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    author: PropTypes.string.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    channelName: PropTypes.string.isRequired,
    channelType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onOpen() {
    window.open(this.props.url)
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
    } else {
      className = classes.icon
      const svg = icons[this.props.category] || icons.file
      iconStyle = {
        backgroundImage: `url('${svg}')`
      }
    }

    return <div className={className} style={iconStyle}></div>
  }

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
          <p className={classes.meta}>{tz(this.props.time).format(dateFormat)} - {this.props.author}</p>
          <p className={classes.meta}>
            Shared {this.props.channelType === 'room' ? 'in' : 'with'} {this.props.channelName}
          </p>
        </div>
      </section>
    )
  }
}
