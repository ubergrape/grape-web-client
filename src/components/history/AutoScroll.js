import {Component, PropTypes} from 'react'
import ReactDom from 'react-dom'

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
    rows: []
  }

  constructor(props) {
    super(props)
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
      const prevRenderedRow = this.props.rows[this.renderedRows.startIndex]
      const prevStartIndex = nextProps.rows.indexOf(prevRenderedRow)

      if (prevStartIndex === -1) return

      let addedHeight = 0
      for (let i = 0; i < prevStartIndex; i++) {
        const height = this.props.rowHeight(i)
        if (height) addedHeight += height
      }

      this.childrenParam.scrollTop = addedHeight
    }
  }

  onScroll({scrollHeight, clientHeight, scrollTop}) {
    this.childrenParam.scrollTop = scrollTop

    if (!clientHeight) return

    const bottomThreshold = scrollHeight - scrollTop - clientHeight
    if (bottomThreshold < this.props.bottomThreshold) {
      this.childrenParam.scrollTop = scrollTop + clientHeight
    }
  }

  onRowsRendered(params) {
    this.renderedRows = params
  }

  render() {
    return this.props.children(this.childrenParam)
  }
}
