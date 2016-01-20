import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'
import noop from 'lodash/utility/noop'

import ImageZoom from '../image-zoom/ImageZoom'

import {useSheet} from 'grape-web/lib/jss'
import * as icons from 'grape-web/lib/svg-icons/data'
import {openUrl} from 'grape-web/lib/x-platform'
import style from './sharedFileStyle'
const dateFormat = 'MMM Do, h:mm a'

@useSheet(style)
export default class SharedFile extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    channelName: PropTypes.string.isRequired,
    channelType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    author: PropTypes.string,
    thumbnailUrl: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onOpen() {
    openUrl(this.props.url)
  }

  setPreviewRef(ref) {
    this.preview = ref
  }

  getPreviewRef() {
    return this.preview
  }

  renderPreview() {
    const {classes} = this.props.sheet
    const {thumbnailUrl} = this.props
    let className
    let backgroundImage

    if (thumbnailUrl) {
      className = classes.thumbnail
      backgroundImage = `url(${thumbnailUrl})`
    } else {
      className = classes.icon
      const svg = icons[this.props.category] || icons.file
      backgroundImage = `url('${svg}')`
    }

    return (
      <div
        ref={::this.setPreviewRef}
        className={className}
        style={{backgroundImage}}>
      </div>
    )
  }

  renderSection(handleClick) {
    const {classes} = this.props.sheet
    const {channelType, channelName, time, author, name} = this.props
    const where = `Shared ${channelType === 'room' ? 'in' : 'with'} ${channelName}`
    let when = tz(time).format(dateFormat)
    if (author) when += ` - ${author}`

    return (
      <section
        className={classes.sharedFile}
        onClick={handleClick ? ::this.onOpen : noop}>
        <div className={classes.leftColumn}>
          {this.renderPreview()}
        </div>
        <div className={classes.rightColumn}>
          <h2 className={classes.name}>{name}</h2>
          <p className={classes.meta}>{when}</p>
          <p className={classes.meta}>{where}</p>
        </div>
      </section>
    )
  }

  render() {
    const {thumbnailUrl, url} = this.props
    const section = this.renderSection(!Boolean(thumbnailUrl))

    if (thumbnailUrl) {
      return (
        <ImageZoom
          getPreviewRef={::this.getPreviewRef}
          url={url}>
          {section}
        </ImageZoom>
      )
    }

    return section
  }
}
