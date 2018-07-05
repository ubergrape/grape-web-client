import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import ImageZoom from '../../image-zoom/ImageZoom'

import { styles } from './imageAttachmentTheme'

function calcThumbnailSize(options) {
  const {
    thumbnailWidth,
    thumbnailHeight,
    maxThumbnailWidth,
    maxThumbnailHeight,
  } = options

  // Landscape
  if (thumbnailWidth >= thumbnailHeight) {
    const width = Math.min(thumbnailWidth, maxThumbnailWidth)
    const height = Math.round((width * thumbnailHeight) / thumbnailWidth)
    return { width, height }
  }

  // Portrait
  const height = Math.min(maxThumbnailHeight, thumbnailHeight)
  const width = (height * thumbnailWidth) / thumbnailHeight
  return { width, height }
}

@injectSheet(styles)
export default class ImageAttachment extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object,
    url: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    thumbnailWidth: PropTypes.number.isRequired,
    thumbnailHeight: PropTypes.number.isRequired,
    maxThumbnailWidth: PropTypes.number,
    maxThumbnailHeight: PropTypes.number,
  }

  static defaultProps = {
    maxThumbnailWidth: 360,
    maxThumbnailHeight: 360,
    sheet: null,
  }

  getThumbnailRef = () => this.thumbnail

  setThumbnailRef = ref => {
    this.thumbnail = ref
  }

  render() {
    const {
      sheet: { classes },
      url,
      thumbnailUrl,
      thumbnailWidth,
      thumbnailHeight,
      maxThumbnailWidth,
      maxThumbnailHeight,
    } = this.props
    const backgroundImage = `url(${thumbnailUrl})`

    return (
      <ImageZoom
        getPreviewRef={this.getThumbnailRef}
        url={url}
        className={classes.thumbnail}
        setRef={this.setThumbnailRef}
        style={{
          backgroundImage,
          ...calcThumbnailSize({
            thumbnailWidth,
            thumbnailHeight,
            maxThumbnailWidth,
            maxThumbnailHeight,
          }),
        }}
      />
    )
  }
}
