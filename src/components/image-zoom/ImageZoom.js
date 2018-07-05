import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import ImageZoom from 'image-zoom'
import injectSheet from 'grape-web/lib/jss'
import { zIndex } from '../../utils/z-index'

/**
 * Wrapper around image-zoom lib.
 * TODO replace it by something better.
 */
const styles = {
  '@global': {
    '.zoom-image': {
      cursor: 'pointer',
    },
    '.zoom-image-clone': {
      position: 'fixed',
      transition: 'transform 0.2s linear',
      zIndex: zIndex('dialog', 2),
      cursor: 'zoom-out',
    },
    '.loading': {
      transition: 'transform 0.2s linear',
      opacity: 0.75,
      cursor: 'progress',
    },
    '.image-zoom-overlay': {
      position: 'fixed',
      zIndex: zIndex('dialog', 1),
      cursor: 'zoom-out',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      opacity: 0,
      transition: 'opacity 0.2s linear',
      '&.show': {
        isolate: false,
        opacity: 1,
      },
    },
  },
}

class ImageZoomComponent extends PureComponent {
  static propTypes = {
    setRef: PropTypes.func,
    url: PropTypes.string.isRequired,
    getPreviewRef: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
  }

  static defaultProps = {
    setRef: null,
    children: undefined,
    className: undefined,
    style: undefined,
  }

  onZoom = () => {
    const { getPreviewRef, url } = this.props
    const previewNode = getPreviewRef()
    return new ImageZoom(previewNode, url)
      .overlay()
      .padding(20)
      .show()
  }

  render() {
    const { className, style, setRef, children } = this.props
    return (
      <div
        className={className}
        onClick={this.onZoom}
        role="presentation"
        style={style}
        ref={setRef}
      >
        {children}
      </div>
    )
  }
}

export default injectSheet(styles)(ImageZoomComponent)
