import {Component, PropTypes} from 'react'
import ReactDom from 'react-dom'

// We use this number to ensure scroll position at the bottom without knowing
// the actuall height of rows initially.
const veryHeighScrollTop = 1000000000

/**
 * Preserves the scroll position at the bottom when messages got added.
 */
export default class AutoScroll extends Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    bottomThreshold: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
    rowHeight: PropTypes.func.isRequired,
    scrollTop: PropTypes.number
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
      onScroll: ::this.onScroll,
      onRowsRendered: ::this.onRowsRendered,
      scrollTop: props.scrollTop
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      // We assume user scrolled up (reverse order) and we have loaded
      // previous rows.
      // When they are inserted at the beginning, they will change our scroll
      // position, so we need to calculate the height of those rows and scroll
      // to the old position.
      if (this.direction < 0 && this.scrollTop === 0) {
        const prevFirstRenderedRow = this.props.rows[this.renderedRows.startIndex]
        const prevFirstRowIndex = nextProps.rows.indexOf(prevFirstRenderedRow)

        if (prevFirstRowIndex === -1) return

        let addedHeight = 0
        for (let i = 0; i < prevFirstRowIndex; i++) {
          const height = this.props.rowHeight(i)
          if (height) addedHeight += height
        }

        this.childrenParam.scrollTop = addedHeight

      // We are at the bottom within a threshold where we need to ensure last
      // message is always in view.
      } else if (this.bottomThreshold < this.props.bottomThreshold) {
        const prevLastRenderedRow = this.props.rows[this.renderedRows.stopIndex]
        const prevLastRowIndex = nextProps.rows.indexOf(prevLastRenderedRow)

        if (prevLastRowIndex === -1) return

        let addedHeight = 0
        for (let i = prevLastRowIndex + 1; i < nextProps.rows.length; i++) {
          const height = this.props.rowHeight(i)
          if (height) addedHeight += height
        }
        this.childrenParam.scrollTop += addedHeight
      }
    }
  }

  onScroll({scrollHeight, clientHeight, scrollTop}) {
    if (this.scrollTop !== undefined && this.scrollTop !== veryHeighScrollTop) {
      this.direction = scrollTop - this.scrollTop
    }
    this.scrollTop = scrollTop
    this.childrenParam.scrollTop = scrollTop
    this.bottomThreshold = scrollHeight - scrollTop - clientHeight
  }

  onRowsRendered(params) {
    this.renderedRows = params
  }

  render() {
    return this.props.children(this.childrenParam)
  }
}
