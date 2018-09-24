import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { borderRadius } from 'grape-theme/dist/sizes'
import { grayLighter } from 'grape-theme/dist/base-colors'

import ImageZoom from '../../../image-zoom/ImageZoom'

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
  const { width, height, maxThumbnailWidth, maxThumbnailHeight } = options

  // Landscape
  if (width >= height) {
    const landWidth = Math.min(width, maxThumbnailWidth)
    const landHeight = Math.round((landWidth * height) / width)
    return { width: landWidth, height: landHeight }
  }

  // Portrait
  const portHeight = Math.min(maxThumbnailHeight, height)
  const portWidth = (portHeight * width) / height
  return { width: portWidth, height: portHeight }
}

@injectSheet(styles)
export default class ImageAttachment extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
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
      width,
      height,
      maxThumbnailWidth,
      maxThumbnailHeight,
    } = this.props

    const backgroundImage = `url(${url})`

    return (
      <ImageZoom
        getPreviewRef={this.getThumbnailRef}
        url={url}
        className={classes.thumbnail}
        ref={this.setThumbnailRef}
        style={{
          backgroundImage,
          ...calcThumbnailSize({
            width,
            height,
            maxThumbnailWidth,
            maxThumbnailHeight,
          }),
        }}
      />
    )
  }
}
