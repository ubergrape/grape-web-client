import React, {PureComponent, PropTypes} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import noop from 'lodash/utility/noop'
import {List, AutoSizer, CellMeasurer, InfiniteLoader} from 'react-virtualized'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import Row from './Row'

const messages = defineMessages({
  title: {
    id: 'intelligentSummarySidebarTitle',
    defaultMessage: 'Intelligent Summary'
  }
})

@injectIntl
export default class LabelsOverview extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    onLoad: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    labels: PropTypes.array.isRequired,
    intl: intlShape.isRequired
  }

  static defaultProps = {
    onLoad: noop,
    hideSidebar: noop,
    labels: []
  }

  componentDidMount() {
    const {labels, onLoad} = this.props
    if (!labels.length) onLoad()
  }

  onLoadMore = ({startIndex, stopIndex}) => (
    new Promise((resolve) => {
      const options = {startIndex, stopIndex}
      this.props.onLoad(options, resolve)
    })
  )

  isRowLoaded = ({index}) => Boolean(this.props.labels[index])

  renderRow = ({index, style}) => {
    const {
      intl,
      labels
    } = this.props

    const label = labels[index]

    return (
      <Row
        intl={intl}
        label={label}
        prevLabel={labels[index - 1]}
        key={`${label.id}-row`}
        style={style}
      />
    )
  }

  renderRowForCellMeasurer = ({rowIndex: index}) => this.renderRow({index})

  render() {
    const {
      hideSidebar,
      intl: {formatMessage},
      labels
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        onClose={hideSidebar}
      >
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.onLoadMore}
          rowCount={labels.length}
        >
          {({onRowsRendered, registerChild}) => (
            <AutoSizer>
              {({width, height}) => (
                <CellMeasurer
                  cellRenderer={this.renderRowForCellMeasurer}
                  columnCount={1}
                  rowCount={labels.length}
                  width={width}
                >
                  {({getRowHeight}) => (
                    <List
                      ref={registerChild}
                      width={width}
                      height={height}
                      rowCount={labels.length}
                      rowHeight={getRowHeight}
                      rowRenderer={this.renderRow}
                      onRowsRendered={onRowsRendered}
                      overscanRowCount={5}
                    />
                  )}
                </CellMeasurer>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </SidebarPanel>
    )
  }
}
