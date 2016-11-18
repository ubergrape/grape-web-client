import {PureComponent, PropTypes} from 'react'
import findIndex from 'lodash/array/findIndex'

/**
 * Preserves the scroll position at the end when rows got added.
 */
export default class AutoScroll extends PureComponent {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    minEndThreshold: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    scrollToIndex: PropTypes.number
  }

  static defaultProps = {
    minEndThreshold: 20,
    rows: []
  }

  constructor(props) {
    super(props)
    this.direction = 0
  }

  componentWillReceiveProps(nextProps) {
    const {rows, height, minEndThreshold} = this.props
    const rowsHasChanged = nextProps.rows !== rows

    if (nextProps.scrollToIndex !== undefined) {
      this.scrollToIndex = nextProps.scrollToIndex
      this.scrollToAlignment = 'center'
      return
    }

    if (rowsHasChanged) {
      // We assume user scrolled up (reverse order) and we have loaded
      // previous rows.
      // When they are inserted at the beginning, they will change our scroll
      // position, so we need to calculate the height of those rows and scroll
      // to the old position.
      if (this.direction < 0 && this.scrollTop === 0) {
        const prevFirstRenderedRowId = rows[this.startIndex].id
        const prevFirstRowIndex = findIndex(nextProps.rows, {id: prevFirstRenderedRowId})
        if (prevFirstRowIndex !== -1) {
          this.scrollToIndex = prevFirstRowIndex
          this.scrollToAlignment = 'start'
        }
        return
      }
    }

    // We way need to auto scroll when:
    // - Rows has been changed.
    // - Parent size has changed.
    if (rowsHasChanged || nextProps.height !== height) {
      const endThreshold = this.scrollHeight - this.scrollTop - this.clientHeight

      // We are at the end within a threshold where we need to ensure last
      // message is always in view.
      if (endThreshold < minEndThreshold) {
        this.scrollToIndex = nextProps.rows.length - 1
        this.scrollToAlignment = 'end'
      }
      return
    }
  }

  onScroll = ({scrollHeight, clientHeight, scrollTop}) => {
    if (this.scrollTop !== undefined) {
      this.direction = scrollTop - this.scrollTop
    }
    this.scrollTop = scrollTop
    this.scrollHeight = scrollHeight
    this.clientHeight = clientHeight
    this.scrollToIndex = undefined
  }

  onRowsRendered = ({startIndex}) => {
    this.startIndex = startIndex
  }

  render() {
    return this.props.children({
      onScroll: this.onScroll,
      onRowsRendered: this.onRowsRendered,
      scrollToIndex: this.scrollToIndex,
      scrollToAlignment: this.scrollToAlignment
    })
  }
}
