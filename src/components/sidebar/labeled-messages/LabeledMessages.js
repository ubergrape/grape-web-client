import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import noop from 'lodash/utility/noop'
import List from 'react-virtualized/dist/es/List'
import AutoSizer from 'react-virtualized/dist/es/AutoSizer'
import CellMeasurer from 'react-virtualized/dist/es/CellMeasurer'
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader'
import injectSheet from 'grape-web/lib/jss'

import SidebarPanel from '../SidebarPanel'
import Options from '../Options'
import Row from './Row'
import NoContent from './NoContent'
import Filter from './Filter'
import TrainingModeHint from './TrainingModeHint'

const translations = defineMessages({
  title: {
    id: 'labeledMessagesSidebarTitle',
    defaultMessage: 'Important Messages'
  }
})

@injectSheet({
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  messages: {
    position: 'relative',
    flex: 1
  },
  list: {
    outline: 0
  }
})
@injectIntl
export default class LabeledMessages extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onLoad: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    onSelectFilter: PropTypes.func,
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
    }),
    labelConfigs: PropTypes.array,
    filter: PropTypes.string
  }

  static defaultProps = {
    onLoad: noop,
    onClose: noop,
    onSelect: noop,
    onSelectFilter: noop,
    messages: [],
    user: {},
    channel: {},
    options: [],
    labelConfigs: [],
    isLoading: false,
    currentChannelOnly: false,
    newMessagesAmount: 0,
    filter: 'all'
  }

  componentDidMount() {
    const {messages, onLoad} = this.props
    if (!messages.length) onLoad()
  }

  componentWillReceiveProps(nextProps) {
    const {messages, currentChannelOnly, channel, filter, onLoad} = this.props
    if (
      // We need to refresh when this option changes.
      nextProps.currentChannelOnly !== currentChannelOnly ||
      // When there was no messages and now `newMessagesAmount` got increased
      // we can load the list, there is no need to show "refresh" button.
      (!messages.length && nextProps.newMessagesAmount > 0) ||
      // When channel was changed and we search in the current channel only,
      // we need to reload.
      (currentChannelOnly && channel.id !== nextProps.channel.id) ||
      nextProps.filter !== filter
    ) {
      onLoad()
    }
  }

  componentDidUpdate(prevProps) {
    const {messages, newMessagesAmount} = prevProps

    // Cases:
    // - Update the first row to show "refresh" button.
    // - Update all messages on filter change.
    if (
      messages !== this.props.messages ||
      newMessagesAmount !== this.props.newMessagesAmount
    ) {
      // First row will change the output.
      this.cellMeasurer.resetMeasurements()
      this.list.recomputeRowHeights(0)
      this.infiniteLoader.forceUpdate()
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
      onSelect,
      messages,
      user,
      onLoad,
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
        onSelect={() => onSelect(message)}
        onRefresh={onLoad}
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
    const {isLoading, messages, classes} = this.props

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
                className={classes.list}
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
      onSelectFilter,
      intl: {formatMessage},
      classes,
      labelConfigs,
      filter
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(translations.title)}
        onClose={onClose}
        options={this.renderOptions()}
        className={classes.sidebar}
      >
        <div className={classes.body}>
          <Filter
            items={labelConfigs}
            onSelect={onSelectFilter}
            selected={filter}
          />
          <div className={classes.messages}>
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.onLoadMore}
              rowCount={Infinity}
              ref={this.onRefInfiniteLoader}
            >
              {this.renderList}
            </InfiniteLoader>
          </div>
          <TrainingModeHint />
        </div>
      </SidebarPanel>
    )
  }
}
