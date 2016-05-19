import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import bindAll from 'lodash/function/bindAll'

import ImageZoom from '../../image-zoom/ImageZoom'

import styles from './imageAttachmentStyles'

@useSheet(styles)
export default class ImageAttachment extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    thumbnailWidth: PropTypes.number.isRequired,
    thumbnailHeight: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
    bindAll(this, 'getThumbnailRef', 'setThumbnailRef')
  }

  getThumbnailRef() {
    return this.thumbnail
  }

  setThumbnailRef(ref) {
    this.thumbnail = ref
  }

  render() {
    const {
      sheet,
      url,
      thumbnailUrl,
      thumbnailWidth: width,
      thumbnailHeight: height
    } = this.props
    const backgroundImage = `url(${thumbnailUrl})`

    return (
      <ImageZoom
        getPreviewRef={this.getThumbnailRef}
        url={url}>
        <div
          ref={this.setThumbnailRef}
          className={sheet.classes.thumbnail}
          style={{backgroundImage, width, height}}></div>
      </ImageZoom>
    )
  }
}
