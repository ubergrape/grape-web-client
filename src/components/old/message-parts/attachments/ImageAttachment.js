import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { borderRadius } from 'grape-theme/dist/sizes'
import { grayLighter } from 'grape-theme/dist/base-colors'

import ImageZoom from '../../image-zoom/ImageZoom'

export const styles = {
  thumbnail: {
    borderRadius: borderRadius.big,
    background: 'no-repeat center',
    backgroundSize: 'contain',
    backgroundColor: grayLighter,
    cursor: 'pointer',
    maxWidth: '100%',
    display: 'block',
    marginBottom: 5,
    '&:last-of-type': {
      isolate: false,
      marginBottom: 0,
    },
  },
}

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

class ImageAttachment extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
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
        ref={this.setThumbnailRef}
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

export default injectSheet(styles)(ImageAttachment)
