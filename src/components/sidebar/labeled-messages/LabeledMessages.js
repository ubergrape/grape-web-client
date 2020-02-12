import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import noop from 'lodash/noop'
import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import {
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized/dist/commonjs/CellMeasurer'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
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
    defaultMessage: 'Important Messages',
  },
})

@injectSheet({
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messages: {
    position: 'relative',
    flex: 1,
  },
  list: {
    outline: 0,
  },
})
@injectIntl
export default class LabeledMessages extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    colors: PropTypes.object,
    customEmojis: PropTypes.object,
    intl: intlShape.isRequired,
    onLoad: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    onSelectFilter: PropTypes.func,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string.isRequired,
      }),
    ),
    user: PropTypes.object,
    options: PropTypes.array,
    isLoading: PropTypes.bool,
    newMessagesAmount: PropTypes.number,
    currentChannelOnly: PropTypes.bool,
    channel: PropTypes.shape({
      id: PropTypes.number,
    }),
    labelsConfig: PropTypes.array,
    filter: PropTypes.string,
  }

  static defaultProps = {
    onLoad: noop,
    onClose: noop,
    onSelect: noop,
    onSelectFilter: noop,
    messages: [],
    user: {},
    colors: {},
    customEmojis: {},
    channel: {},
    options: [],
    labelsConfig: [],
    isLoading: false,
    currentChannelOnly: false,
    newMessagesAmount: 0,
    filter: 'all',
  }

  componentDidMount() {
    const { messages, onLoad } = this.props
    if (!messages.length) onLoad()
  }

  componentWillReceiveProps(nextProps) {
    const { messages, currentChannelOnly, channel, filter, onLoad } = this.props
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
    const { messages, newMessagesAmount } = prevProps

    // Cases:
    // - Update the first row to show "refresh" button.
    // - Update all messages on filter change.
    if (
      messages !== this.props.messages ||
      newMessagesAmount !== this.props.newMessagesAmount
    ) {
      this.cache.clearAll()
      this.list.scrollToPosition(0)
      this.list.recomputeRowHeights(0)
      this.infiniteLoader.forceUpdate()
    }
  }

  onLoadMore = ({ startIndex, stopIndex }) =>
    new Promise(resolve => {
      const { messages, onLoad } = this.props
      const options = {
        offset: messages[messages.length - 1].time,
        limit: stopIndex - startIndex,
      }
      onLoad(options, resolve)
    })

  onRefInfiniteLoader = ref => {
    this.infiniteLoader = ref
  }

  cache = new CellMeasurerCache({ fixedWidth: true })

  isRowLoaded = ({ index }) => Boolean(this.props.messages[index])

  renderRow = ({ key, index, parent, style }) => {
    const {
      intl,
      messages,
      user,
      customEmojis,
      onSelect,
      onLoad,
      newMessagesAmount,
    } = this.props

    const message = messages[index]

    return (
      <CellMeasurer
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        key={key}
        rowIndex={index}
      >
        <Row
          intl={intl}
          customEmojis={customEmojis}
          message={message}
          prevMessage={messages[index - 1]}
          newMessagesAmount={index === 0 ? newMessagesAmount : 0}
          user={user}
          onSelect={onSelect}
          onRefresh={onLoad}
          style={style}
        />
      </CellMeasurer>
    )
  }

  renderNoContent = () => (this.props.isLoading ? null : <NoContent />)

  renderOptions = () => {
    const { options, isLoading } = this.props
    if (!options) return null
    return <Options options={options} isLoading={isLoading} />
  }

  renderList = ({ onRowsRendered, registerChild }) => {
    const { isLoading, messages, classes } = this.props

    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={ref => {
              registerChild(ref)
              this.list = ref
            }}
            width={width}
            height={height}
            rowCount={messages.length}
            rowHeight={this.cache.rowHeight}
            rowRenderer={this.renderRow}
            noRowsRenderer={this.renderNoContent}
            onRowsRendered={onRowsRendered}
            overscanRowCount={5}
            isLoading={isLoading}
            className={classes.list}
            deferredMeasurementCache={this.cache}
          />
        )}
      </AutoSizer>
    )
  }

  render() {
    const {
      onClose,
      onSelectFilter,
      intl: { formatMessage },
      classes,
      colors,
      labelsConfig,
      filter,
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(translations.title)}
        onClose={onClose}
        colors={colors}
        options={this.renderOptions()}
        className={classes.sidebar}
      >
        <div className={classes.body}>
          <Filter
            items={labelsConfig}
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
