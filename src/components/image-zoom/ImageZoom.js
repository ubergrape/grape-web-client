import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import ImageZoom from 'image-zoom'

/**
 * Wrapper around image-zoom lib.
 * TODO maybe replace it by something better.
 */
export default class ImageZoomComponent extends Component {
  static propTypes = {
    children: PropTypes.node,
    url: PropTypes.string,
    getPreviewRef: PropTypes.func
  }

  onZoom() {
    const {getPreviewRef, url} = this.props
    const previewNode = ReactDOM.findDOMNode(getPreviewRef())
    return new ImageZoom(previewNode, url).overlay().padding(20).show()
  }

  render() {
    return (
      <div
        onClick={::this.onZoom}>
        {this.props.children}
      </div>
    )
  }
}
