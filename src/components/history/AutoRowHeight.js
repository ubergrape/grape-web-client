import React, {Component, PropTypes} from 'react'
import {findDOMNode, render, unmountComponentAtNode} from 'react-dom'
import bindAll from 'lodash/function/bindAll'
import noop from 'lodash/utility/noop'


/**
 * Get the height of an element.
 * If it is not rendered, use `container` to render it and detect the height.
 * If it is already rendered, detect the height in place.
 */
function getHeight(element, container, callback) {
  const node = element.render && findDOMNode(element)

  if (node) {
    callback(node.clientHeight)
    return
  }

  // Callback's context is the node.
  render(element, container, function() {
    const {clientHeight} = this
    unmountComponentAtNode(container)
    callback(clientHeight)
  })
}

const hiddenContainerStyle = {
  position: 'absolute',
  visibility: 'hidden',
  width: '100%',
  zIndex: -1
}

// Needed because container becomes relative position and needs to take max
// possible width and height.
const containerStyle = {
  width: '100%',
  height: '100%'
}

export default class AutoRowHeight extends Component {
  static propTypes = {
    cacheSize: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.node),
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    cacheSize: 500
  }

  constructor(props) {
    super(props)
    this.updateCache([])
    this.childrenParam = bindAll(this, 'onResize', 'rowHeight', 'renderRow',
      'isRowLoaded', 'registerChild', 'recomputeRowHeights')
    this.heightsInitialized = false
  }

  componentDidMount() {
    this.hiddenContainer = findDOMNode(this.refs.hiddenContainer)
    this.calcAndCacheHeights(this.props.rows, false, () => {
      this.heightsInitialized = true
      this.forceUpdate()
    })
  }

  componentWillReceiveProps({rows}) {
    this.updateCache(rows)
    this.calcAndCacheHeights(rows)
  }

  onResize({width}) {
    // Only recalc heights when width has changed.
    if (!this.width || this.width === width) {
      this.width = width
      return
    }

    this.calcAndCacheHeights(this.props.rows, true, this.recomputeRowHeights)
  }

  registerChild(ref) {
    this.scroller = ref
  }

  recomputeRowHeights() {
    this.scroller.recomputeRowHeights()
  }

  /**
   * Get the cached height.
   */
  rowHeight(index) {
    const element = this.renderRow(index)
    return this.heights.get(element)
  }

  /**
   * A row is loaded when data is fetched and height is detected.
   */
  isRowLoaded(index) {
    const element = this.renderRow(index)
    return this.heights.has(element)
  }

  calcAndCacheHeights(rows, update, callback = noop) {
    rows.forEach((element, index) => {
      if (this.heights.has(element) && !update) {
        callback()
        return
      }

      getHeight(element, this.hiddenContainer, height => {
        this.heights.set(element, height)
        if (index === rows.length - 1) {
          callback()
        }
      })
    })
  }

  /**
   * Ensure only current elements heights are cached.
   * Otherwise we will leak refs to the old elements.
   */
  updateCache(nextElements) {
    // Key is element, value is height.
    const cache = new WeakMap()
    nextElements.forEach(element => {
      const height = this.heights.get(element)
      if (height) cache.set(element, height)
    })
    this.heights = cache
    // Iterable elements cache which is in sync with heights.
    // WeakMaps are not iterable.
    this.elements = nextElements
  }

  /**
   * Get the cached element.
   */
  renderRow(index) {
    return this.props.rows[index]
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={hiddenContainerStyle} ref="hiddenContainer"></div>
        {this.heightsInitialized && this.props.children(this.childrenParam)}
      </div>
    )
  }
}
