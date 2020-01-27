import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { findIndex, isFunction, isEqualWith } from 'lodash'
import {
  SCROLL_TO_ALIGNMENT_START,
  SCROLL_TO_ALIGNMENT_END,
} from '../../../constants/history'

const isDeepEqualRows = (rowsA, rowsB) =>
  isEqualWith(rowsA, rowsB, (val1, val2) => {
    // should not impact rendering and therefor we can ignore them
    if (isFunction(val1) && isFunction(val2)) {
      return true
    }
    return undefined
  })

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
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.string,
    loadedNewerMessage: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    rows: [],
    scrollToIndex: undefined,
    scrollToAlignment: null,
  }

  // eslint-disable-next-line react/sort-comp
  direction = 0

  componentWillReceiveProps(nextProps) {
    const { rows, height, minEndThreshold } = this.props
    const rowsHaveChanged = !isDeepEqualRows(rows, nextProps.rows)

    // the case where you scroll to a specific message
    if (nextProps.scrollToIndex !== undefined) {
      this.scrollToIndex = nextProps.scrollToIndex
      this.scrollToAlignment = SCROLL_TO_ALIGNMENT_END

      if (nextProps.scrollToAlignment) {
        // scrollToAlignment by default is set to the end when we load the channel
        // and set to start (specified by Felix) in case the message is selected.
        this.scrollToAlignment = nextProps.scrollToAlignment
      } else {
        // If scrollToAlignment is not defined `end` seems to be a safe bet
        // in a chat where we want to scroll to the bottom most of the times
        this.scrollToAlignment = SCROLL_TO_ALIGNMENT_END
      }
      return
    }

    // We assume user scrolled up (reverse order) and we have loaded
    // previous rows.
    // When they are inserted at the beginning, they will change our scroll
    // position, so we need to calculate the height of those rows and scroll
    // to the old position.
    if (rowsHaveChanged && this.direction < 0 && this.scrollTop === 0) {
      const prevFirstRenderedRowId = rows[this.startIndex].id
      const prevFirstRowIndex = findIndex(nextProps.rows, {
        id: prevFirstRenderedRowId,
      })
      if (prevFirstRowIndex !== -1) {
        this.scrollToIndex = prevFirstRowIndex
        this.scrollToAlignment = SCROLL_TO_ALIGNMENT_START
      }
      return
    }

    // TODO track if a bulk of messages have been loaded while scrolling down

    // Auto scrolling to the bottom when:
    // - A new message was added by the current user
    // - A new message was received (can be from another user or the same user on another client)
    // - A any of the messages on screen changed e.g. got longer.
    // - Parent size has changed and the scroll position was close to the bottom.
    // Prevent auto scrolling to the bottom when:
    // - The user scrolled to the bottom and a batch of new messages was loaded to prevent GRAPE-15407
    if (
      (rowsHaveChanged && !nextProps.loadedNewerMessage) ||
      nextProps.height !== height
    ) {
      const endThreshold =
        this.scrollHeight - this.scrollTop - this.clientHeight

      // We are at the end within a threshold where we need to ensure last
      // message is always in view.
      if (endThreshold < minEndThreshold) {
        this.scrollToIndex = nextProps.rows.length - 1
        this.scrollToAlignment = SCROLL_TO_ALIGNMENT_END
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
