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

const messages = defineMessages({
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
  }
})
@injectIntl
export default class LabelsOverview extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onLoad: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    labels: PropTypes.array,
    user: PropTypes.object,
    intl: intlShape.isRequired,
    options: PropTypes.array,
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    onLoad: noop,
    onClose: noop,
    onSelect: noop,
    labels: [],
    user: {},
    options: [],
    isLoading: false
  }

  componentDidMount() {
    const {labels, onLoad} = this.props
    if (!labels.length) onLoad()
  }

  componentWillReceiveProps(nextProps) {
    const {onLoad, labels} = nextProps
    if (!labels.length) onLoad()
  }

  onLoadMore = ({startIndex, stopIndex}) => (
    new Promise((resolve) => {
      const {labels, onLoad} = this.props
      const options = {
        offset: labels[labels.length - 1].message.time,
        limit: stopIndex - startIndex
      }
      onLoad(options, resolve)
    })
  )

  isRowLoaded = ({index}) => Boolean(this.props.labels[index])

  renderRow = ({index, style}) => {
    const {
      intl,
      labels,
      user,
      onSelect
    } = this.props

    const label = labels[index]

    return (
      <Row
        intl={intl}
        label={label}
        prevLabel={labels[index - 1]}
        key={`${label.id}-row`}
        style={style}
        user={user}
        onSelect={onSelect}
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
    const {labels, isLoading} = this.props

    return (
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
      labels,
      classes
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        onClose={onClose}
        options={this.renderOptions()}
      >
        <div className={classes.overview}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.onLoadMore}
            rowCount={Infinity}
            // Forcing rerender.
            labels={labels}
          >
            {this.renderList}
          </InfiniteLoader>
        </div>
      </SidebarPanel>
    )
  }
}
