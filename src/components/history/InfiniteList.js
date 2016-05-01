import {InfiniteLoader, VirtualScroll, AutoSizer} from 'react-virtualized'
import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import AutoRowHeight from './AutoRowHeight'
import styles from './infiniteListStyles'

@useSheet(styles)
export default class InfiniteList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    rows: PropTypes.arrayOf(PropTypes.node)
  }

  render() {
    const {sheet, rows} = this.props
    const {classes} = sheet
    console.log('received rows', this.props.rows.length)
    return (
      <AutoRowHeight rows={rows}>
        {({
          onResize,
          rowHeight,
          renderRow,
          isRowLoaded,
          registerChild: registerChildInAutoRowHeight
        }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={this.props.onLoadMore}
            rowsCount={Infinity}
            threshold={50}
            minimumBatchSize={50}>
            {({onRowsRendered, registerChild}) => (
              <AutoSizer onResize={onResize}>
                {({width, height}) => (
                  <VirtualScroll
                    className={classes.grid}
                    ref={ref => {
                      registerChild(ref)
                      registerChildInAutoRowHeight(ref)
                    }}
                    onRowsRendered={onRowsRendered}
                    width={width}
                    height={height}
                    rowsCount={rows.length}
                    rowHeight={rowHeight}
                    rowRenderer={renderRow} />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        )}
      </AutoRowHeight>
    )
  }
}
