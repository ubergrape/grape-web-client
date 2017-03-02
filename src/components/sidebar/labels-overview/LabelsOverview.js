import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import noop from 'lodash/utility/noop'
import {List, AutoSizer, CellMeasurer} from 'react-virtualized'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import Row from './Row'

const messages = defineMessages({
  title: {
    id: 'intelligentSummarySidebarTitle',
    defaultMessage: 'Intelligent Summary'
  }
})

@injectSheet({
})
@injectIntl
export default class LabelsOverview extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    load: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    labels: PropTypes.array.isRequired,
    intl: intlShape.isRequired,
    total: PropTypes.number
  }

  static defaultProps = {
    load: noop,
    hideSidebar: noop,
    messages: [],
    total: null
  }

  componentDidMount() {
    const {labels} = this.props
    if (!labels.length) this.load()
  }

  componentWillReceiveProps(nextProps) {
    const reset = !nextProps.labels.length &&
      nextProps.total == null &&
      this.props.total != null

    if (reset) this.load(nextProps)
  }

  onLoadMore = () => {
    this.load()
  }

  load({load} = this.props) {
    load()
  }

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
                  width={width}
                  height={height}
                  rowCount={labels.length}
                  rowHeight={getRowHeight}
                  rowRenderer={this.renderRow}
                  overscanRowCount={5}
                  ref={this.onRefList}
                />
              )}
            </CellMeasurer>
          )}
        </AutoSizer>
      </SidebarPanel>
    )
  }
}
