import React, {Component, PropTypes} from 'react'
import {
  findDOMNode,
  unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer, // eslint-disable-line camelcase
  unmountComponentAtNode
} from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import pick from 'lodash/object/pick'
import noop from 'lodash/utility/noop'

/**
 * Replacement for WeakMaps, because IE as well as polyfils can't use frozen
 * objects as a key.
 */
class Cache {
  constructor() {
    this.keys = []
    this.values = []
  }

  has(key) {
    return this.keys.indexOf(key) !== -1
  }

  get(key) {
    const index = this.keys.indexOf(key)
    return index === -1 ? undefined : this.values[index]
  }

  set(key, value) {
    let index = this.keys.indexOf(key)
    if (index === -1) index = this.keys.length
    this.keys[index] = key
    this.values[index] = value
  }
}

/**
 * Get the height of an element.
 * If it is not rendered, use `container` to render it and detect the height.
 * If it is already rendered, detect the height in place.
 */
function getHeight(component, element, container, callback) {
  const node = element.render && findDOMNode(element)

  if (node) {
    callback(node.clientHeight)
    return
  }

  // Using unstable `react-dom` API to render with `context`
  // https://github.com/facebook/react/issues/4706
  renderSubtreeIntoContainer(component, element, container, function onRender() {
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
    cacheSize: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.node).isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    cacheSize: 500
  }

  constructor(props) {
    super(props)
    this.updateCache([])
    this.childrenParam = pick(this, 'onResize', 'getRowHeight', 'renderRow',
      'isRowLoaded', 'registerScroller', 'recomputeRowHeights')
    this.heightsInitialized = false
  }

  componentDidMount() {
    this.calcAndCacheHeights(this.props.rows, false, () => {
      this.heightsInitialized = true
      this.forceUpdate()
    })
  }

  componentWillReceiveProps({rows}) {
    this.updateCache(rows)
    this.calcAndCacheHeights(rows)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    this.recomputeRowHeights()
  }

  onResize = ({width}) => {
    const prevWidth = this.width
    this.width = width
    // Only recalc heights when width has changed.
    if (prevWidth === undefined || prevWidth === width) return
    this.calcAndCacheHeights(this.props.rows, true, this.recomputeRowHeights)
  }

  onMountHiddenContainer = (container) => {
    this.hiddenContainer = container
  }

  /**
   * Get the cached height.
   */
  getRowHeight = (index) => {
    const element = this.renderRow(index)
    return this.heights.get(element)
  }

  /**
   * A row is loaded when data is fetched and height is detected.
   */
  isRowLoaded = (index) => {
    const element = this.renderRow(index)
    return this.heights.has(element)
  }

  calcAndCacheHeights(rows, update, callback = noop) {
    rows.forEach((element, index) => {
      const done = () => {
        if (index === rows.length - 1) {
          callback()
        }
      }

      if (this.heights.has(element) && !update) {
        done()
        return
      }

      getHeight(this, element, this.hiddenContainer, height => {
        this.heights.set(element, height)
        done()
      })
    })
  }


  /**
   * Ensure only current elements heights are cached.
   * Otherwise we will leak refs to the old elements.
   */
  updateCache(nextElements) {
    // Key is element, value is height.
    const cache = new Cache()
    nextElements.forEach(element => {
      const height = this.heights.get(element)
      if (height) cache.set(element, height)
    })
    this.heights = cache
  }

  registerScroller = (ref) => (this.scroller = ref)

  recomputeRowHeights = () => (this.scroller.recomputeRowHeights())

  /**
   * Get the cached element.
   */
  renderRow = (index) => (this.props.rows[index])

  render() {
    return (
      <div style={containerStyle}>
        <div style={hiddenContainerStyle} ref={this.onMountHiddenContainer}></div>
        {this.heightsInitialized && this.props.children(this.childrenParam)}
      </div>
    )
  }
}
