import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import ImageZoom from 'image-zoom'
import shallowCompare from 'react-addons-shallow-compare'

/**
 * Wrapper around image-zoom lib.
 * TODO maybe replace it by something better.
 */
export default class ImageZoomComponent extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    getPreviewRef: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
        style={style}>
        {children}
      </div>
    )
  }
}
