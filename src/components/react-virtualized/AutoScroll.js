import {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'

// We use this number to ensure scroll position at the bottom without knowing
// the actuall height of rows initially.
const veryHeighScrollTop = 1000000000

/**
 * Preserves the scroll position at the bottom when rows got added.
 */
export default class AutoScroll extends Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    bottomThreshold: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
    rowHeight: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    scrollTop: PropTypes.number.isRequired,
    scrollToIndex: PropTypes.number
  }

  static defaultProps = {
    bottomThreshold: 20,
    rows: [],
    scrollTop: veryHeighScrollTop
  }

  constructor(props) {
    super(props)
    this.direction = 0
    this.childrenParam = {
      onScroll: this.onScroll,
      onRowsRendered: this.onRowsRendered,
      scrollToIndex: props.scrollToIndex,
      scrollTop: props.scrollToIndex === undefined ? props.scrollTop : undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    // Once scrollToIndex is passed, we need to unset scrollTop.
    if (nextProps.scrollToIndex !== undefined) {
      this.childrenParam.scrollToIndex = nextProps.scrollToIndex
      this.childrenParam.scrollTop = undefined
      return
    }

    const {rowHeight, rows, height, bottomThreshold} = this.props
    // We are at the bottom within a threshold where we need to ensure last
    // message is always in view.
    const needsAutoScroll = this.bottomThreshold < bottomThreshold

    if (nextProps.rows !== rows) {
      // We assume user scrolled up (reverse order) and we have loaded
      // previous rows.
      // When they are inserted at the beginning, they will change our scroll
      // position, so we need to calculate the height of those rows and scroll
      // to the old position.
      if (this.direction < 0 && this.scrollTop === 0) {
        const prevFirstRenderedRow = rows[this.renderedRows.startIndex]
        const prevFirstRowIndex = nextProps.rows.indexOf(prevFirstRenderedRow)
        if (prevFirstRowIndex === -1) return

        let addedHeight = 0
        for (let index = 0; index < prevFirstRowIndex; index++) {
          const height = rowHeight({index})
          if (height) addedHeight += height
        }

        this.childrenParam.scrollToIndex = undefined
        this.childrenParam.scrollTop = addedHeight
        return
      }

      if (needsAutoScroll) {
        const prevLastRenderedRow = rows[this.renderedRows.stopIndex]
        const prevLastRowIndex = nextProps.rows.indexOf(prevLastRenderedRow)

        if (prevLastRowIndex === -1) return

        let addedHeight = 0
        for (let index = prevLastRowIndex + 1; index < nextProps.rows.length; index++) {
          const height = rowHeight({index})
          if (height) addedHeight += height
        }
        this.childrenParam.scrollToIndex = undefined
        this.childrenParam.scrollTop += addedHeight
      }

      return
    }

    // Parent size has changed, we way need to auto scroll.
    if (needsAutoScroll && nextProps.height !== height) {
      this.childrenParam.scrollTop = veryHeighScrollTop
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onScroll = ({scrollHeight, clientHeight, scrollTop}) => {
    if (this.scrollTop !== undefined && this.scrollTop !== veryHeighScrollTop) {
      this.direction = scrollTop - this.scrollTop
    }
    this.scrollTop = scrollTop
    this.childrenParam.scrollTop = scrollTop
    this.childrenParam.scrollToIndex = undefined
    this.bottomThreshold = scrollHeight - scrollTop - clientHeight
  }

  onRowsRendered = (params) => {
    this.renderedRows = params
  }

  render() {
    return this.props.children(this.childrenParam)
  }
}
