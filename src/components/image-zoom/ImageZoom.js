import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import ImageZoom from 'image-zoom'

/**
 * Wrapper around image-zoom lib.
 * TODO maybe replace it by something better.
 */
export default class ImageZoomComponent extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    getPreviewRef: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
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
