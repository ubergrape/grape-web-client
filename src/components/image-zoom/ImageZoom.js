import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import ImageZoom from 'image-zoom'
import injectSheet from 'grape-web/lib/jss'

/**
 * Wrapper around image-zoom lib.
 * TODO replace it by something better.
 */
@injectSheet({
  '@global': {
    '.zoom-image': {
      cursor: 'pointer'
    },
    '.zoom-image-clone': {
      position: 'fixed',
      transition: 'transform 0.2s linear',
      zIndex: '999',
      cursor: 'zoom-out'
    },
    '#overlay': {
      zIndex: '998',
      cursor: 'zoom-out',
      backgroundColor: 'rgba(0,0,0,0.8)'
    },
    '.loading': {
      transition: 'transform 0.2s linear',
      opacity: '.75',
      cursor: 'progress'
    },
    '.Overlay.image-zoom-overlay': {
      backgroundColor: 'rgba(0,0,0,0.8)'
    }
  }
})
export default class ImageZoomComponent extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    getPreviewRef: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    className: undefined,
    style: undefined,
    children: undefined
  }

  onZoom = () => {
    const {getPreviewRef, url} = this.props
    const previewNode = findDOMNode(getPreviewRef())
    return new ImageZoom(previewNode, url).overlay().padding(20).show()
  }

  render() {
    const {className, style, children} = this.props
    return (
      <div
        onClick={this.onZoom}
        className={className}
        style={style}
      >
        {children}
      </div>
    )
  }
}
