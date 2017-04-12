import React, {PureComponent, PropTypes} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import noop from 'lodash/utility/noop'
import {List, AutoSizer, CellMeasurer, InfiniteLoader} from 'react-virtualized'
import injectSheet from 'grape-web/lib/jss'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import Row from './Row'
import NoContent from './NoContent'
import Options from '../options/Options'
import {spacing} from '../sidebar-panel/theme'

const translations = defineMessages({
  title: {
    id: 'labeledMessagesSidebarTitle',
    defaultMessage: 'Important Messages'
  }
})

@injectSheet({
  overview: {
    position: 'relative',
    width: '100%',
    height: '100%',
    '& $row': {
      marginTop: spacing
    }
  },
  row: {}
})
@injectIntl
export default class LabeledMessages extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onLoad: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.instanceOf(Date).isRequired
      })
    ),
    user: PropTypes.object,
    options: PropTypes.array,
    isLoading: PropTypes.bool,
    newMessagesAmount: PropTypes.number,
    currentChannelOnly: PropTypes.bool,
    channel: PropTypes.shape({
      id: PropTypes.number
    })
  }

  static defaultProps = {
    onLoad: noop,
    onClose: noop,
    onSelect: noop,
    messages: [],
    user: {},
    channel: {},
    options: [],
    isLoading: false,
    currentChannelOnly: false,
    newMessagesAmount: 0
  }

  componentDidMount() {
    const {messages, onLoad} = this.props
    if (!messages.length) onLoad()
  }

  componentWillReceiveProps(nextProps) {
    const {messages, currentChannelOnly, channel, onLoad} = this.props
    if (
      // We need to refresh when this option changes.
      nextProps.currentChannelOnly !== currentChannelOnly ||
      // When there was no messages and now `newMessagesAmount` got increased
      // we can load the list, there is no need to show "refresh" button.
      (!messages.length && nextProps.newMessagesAmount > 0) ||
      // When channel was changed and we search in the current channel only,
      // we need to reload.
      (currentChannelOnly && channel.id !== nextProps.channel.id)
    ) {
      onLoad()
    }
  }

  componentDidUpdate(prevProps) {
    const {messages, newMessagesAmount} = prevProps

    if (messages !== this.props.messages) {
      this.infiniteLoader.forceUpdate()
    }

    // We need to rerender the first row to show "refresh" button.
    if (newMessagesAmount !== this.props.newMessagesAmount) {
      // First row will change the output.
      this.cellMeasurer.resetMeasurements()
      this.list.recomputeRowHeights(0)
    }
  }

  onLoadMore = ({startIndex, stopIndex}) => (
    new Promise((resolve) => {
      const {messages, onLoad} = this.props
      const options = {
        offset: messages[messages.length - 1].time,
        limit: stopIndex - startIndex
      }
      onLoad(options, resolve)
    })
  )

  onRefInfiniteLoader = (ref) => {
    this.infiniteLoader = ref
  }

  onRefCellMeasurer = (ref) => {
    this.cellMeasurer = ref
  }

  isRowLoaded = ({index}) => Boolean(this.props.messages[index])

  renderRow = ({index, style}) => {
    const {
      intl,
      messages,
      user,
      onSelect,
      onLoad,
      classes,
      newMessagesAmount
    } = this.props

    const message = messages[index]

    return (
      <Row
        intl={intl}
        message={message}
        prevMessage={messages[index - 1]}
        newMessagesAmount={index === 0 ? newMessagesAmount : 0}
        key={`${message.id}-row`}
        style={style}
        user={user}
        onSelect={onSelect}
        onRefresh={onLoad}
        className={classes.row}
      />
    )
  }

  renderRowForCellMeasurer = ({rowIndex: index}) => this.renderRow({index})

  renderNoContent = () => (this.props.isLoading ? null : <NoContent />)

  renderOptions = () => {
    const {options, isLoading} = this.props
    if (!options) return null
    return (
      <Options
        options={options}
        isLoading={isLoading}
      />
    )
  }

  renderList = ({onRowsRendered, registerChild}) => {
    const {isLoading, messages} = this.props

    return (
      <AutoSizer>
        {({width, height}) => (
          <CellMeasurer
            cellRenderer={this.renderRowForCellMeasurer}
            columnCount={1}
            rowCount={messages.length}
            width={width}
            ref={this.onRefCellMeasurer}
          >
            {({getRowHeight}) => (
              <List
                ref={(ref) => {
                  registerChild(ref)
                  this.list = ref
                }}
                width={width}
                height={height}
                rowCount={messages.length}
                rowHeight={getRowHeight}
                rowRenderer={this.renderRow}
                noRowsRenderer={this.renderNoContent}
                onRowsRendered={onRowsRendered}
                overscanRowCount={5}
                isLoading={isLoading}
              />
            )}
          </CellMeasurer>
        )}
      </AutoSizer>
    )
  }

  render() {
    const {
      onClose,
      intl: {formatMessage},
      classes
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(translations.title)}
        onClose={onClose}
        options={this.renderOptions()}
      >
        <div className={classes.overview}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.onLoadMore}
            rowCount={Infinity}
            ref={this.onRefInfiniteLoader}
          >
            {this.renderList}
          </InfiniteLoader>
        </div>
      </SidebarPanel>
    )
  }
}
