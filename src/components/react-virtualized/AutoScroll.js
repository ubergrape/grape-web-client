import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import findIndex from 'lodash/array/findIndex'

/**
 * Preserves the scroll position at the end when rows got added.
 */
export default class AutoScroll extends PureComponent {
  static propTypes = {
    rows: PropTypes.array,
    // We use this threshold to make sure that new messages are visible
    // even when the scroll position is not exactly at the end of the history.
    minEndThreshold: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    scrollToIndex: PropTypes.number,
    // eslint-disable-next-line react/no-unused-prop-types
    scrollToRow: PropTypes.func.isRequired,
  }

  static defaultProps = {
    rows: [],
    scrollToIndex: undefined,
  }

  // eslint-disable-next-line react/sort-comp
  direction = 0

  componentWillReceiveProps(nextProps) {
    const { rows, height, minEndThreshold } = this.props
    const rowsHasChanged = nextProps.rows !== rows

    // the case where you scroll to a specific message
    if (nextProps.scrollToIndex !== undefined) {
      this.scrollToIndex = nextProps.scrollToIndex
      // In case we scroll to the last message we want to scroll to the end.
      // This is necessary to render to the bottom of the chat even if the
      // last message is very long.
      // For rendering a specific message in chat Felix asked for the message
      // to be at the top.
      this.scrollToAlignment =
        rows.length === nextProps.scrollToIndex + 1 ? 'end' : 'start'
      return
    }

    // We assume user scrolled up (reverse order) and we have loaded
    // previous rows.
    // When they are inserted at the beginning, they will change our scroll
    // position, so we need to calculate the height of those rows and scroll
    // to the old position.
    if (rowsHasChanged && this.direction < 0 && this.scrollTop === 0) {
      const prevFirstRenderedRowId = rows[this.startIndex].id
      const prevFirstRowIndex = findIndex(nextProps.rows, {
        id: prevFirstRenderedRowId,
      })
      if (prevFirstRowIndex !== -1) {
        this.scrollToIndex = prevFirstRowIndex
        this.scrollToAlignment = 'start'
      }
      return
    }

    // We way need to auto scroll when:
    // - Rows has been changed.
    // - Parent size has changed.
    if (rowsHasChanged || nextProps.height !== height) {
      const endThreshold =
        this.scrollHeight - this.scrollTop - this.clientHeight

      // We are at the end within a threshold where we need to ensure last
      // message is always in view.
      if (endThreshold < minEndThreshold) {
        this.scrollToIndex = nextProps.rows.length - 1
        this.scrollToAlignment = 'end'
      }
    }
  }

  onScroll = ({ scrollHeight, clientHeight, scrollTop }) => {
    if (this.scrollTop !== undefined) {
      this.direction = scrollTop - this.scrollTop
    }
    this.scrollTop = scrollTop
    this.scrollHeight = scrollHeight
    this.clientHeight = clientHeight
    this.scrollToIndex = undefined
  }

  onRowsRendered = ({ startIndex }) => {
    this.startIndex = startIndex
  }

  render() {
    return this.props.children({
      onScroll: this.onScroll,
      onRowsRendered: this.onRowsRendered,
      scrollToIndex: this.scrollToIndex,
      scrollToAlignment: this.scrollToAlignment,
    })
  }
}
