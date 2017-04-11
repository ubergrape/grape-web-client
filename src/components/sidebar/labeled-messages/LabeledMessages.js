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
    id: 'intelligentSummarySidebarTitle',
    defaultMessage: 'Intelligent Summary'
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
    onLoad: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    messages: PropTypes.array,
    user: PropTypes.object,
    intl: intlShape.isRequired,
    options: PropTypes.array,
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    onLoad: noop,
    onClose: noop,
    onSelect: noop,
    messages: [],
    user: {},
    options: [],
    isLoading: false
  }

  componentDidMount() {
    const {messages, onLoad} = this.props
    if (!messages.length) onLoad()
  }

  componentWillReceiveProps(nextProps) {
    const {onLoad, messages} = nextProps
    if (!messages.length) onLoad()
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

  isRowLoaded = ({index}) => Boolean(this.props.messages[index])

  renderRow = ({index, style}) => {
    const {
      intl,
      messages,
      user,
      onSelect,
      classes
    } = this.props

    const message = messages[index]

    return (
      <Row
        intl={intl}
        message={message}
        prevMessage={messages[index - 1]}
        key={`${message.id}-row`}
        style={style}
        user={user}
        onSelect={onSelect}
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
    const {messages, isLoading} = this.props

    return (
      <AutoSizer>
        {({width, height}) => (
          <CellMeasurer
            cellRenderer={this.renderRowForCellMeasurer}
            columnCount={1}
            rowCount={messages.length}
            width={width}
          >
            {({getRowHeight}) => (
              <List
                ref={registerChild}
                width={width}
                height={height}
                rowCount={messages.length}
                rowHeight={getRowHeight}
                rowRenderer={this.renderRow}
                noRowsRenderer={this.renderNoContent}
                onRowsRendered={onRowsRendered}
                overscanRowCount={5}
                // Forcing rerender.
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
      messages,
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
            // Forcing rerender.
            messages={messages}
          >
            {this.renderList}
          </InfiniteLoader>
        </div>
      </SidebarPanel>
    )
  }
}
