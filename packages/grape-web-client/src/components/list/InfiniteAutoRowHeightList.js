import React, { memo } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized'

const InfiniteAutoRowHeightList = memo(
  ({
    isRowLoaded,
    loadMoreRows,
    rowRenderer,
    noRowsRenderer,
    list,
    threshold,
    overscanRowCount,
    minimumBatchSize,
    width,
    rowHeight,
  }) => {
    return (
      <InfiniteLoader
        isRowLoaded={({ index }) => isRowLoaded(index)}
        loadMoreRows={loadMoreRows}
        rowCount={list.length + threshold}
        minimumBatchSize={minimumBatchSize}
        threshold={threshold}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableWidth>
            {({ height }) => (
              <List
                ref={registerChild}
                width={width}
                height={height}
                rowHeight={({ index }) => rowHeight(list, index)}
                rowCount={list.length}
                overscanRowCount={overscanRowCount}
                onRowsRendered={onRowsRendered}
                rowRenderer={({ index, key, style, isVisible }) =>
                  rowRenderer({
                    index,
                    key,
                    style,
                    isVisible,
                  })
                }
                noRowsRenderer={noRowsRenderer}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  },
  (prevProps, nextProps) =>
    isEqual(prevProps.list, nextProps.list) &&
    prevProps.isListLoading === nextProps.isListLoading,
)

InfiniteAutoRowHeightList.propTypes = {
  isRowLoaded: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  noRowsRenderer: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  threshold: PropTypes.number,
  overscanRowCount: PropTypes.number,
  minimumBatchSize: PropTypes.number,
  width: PropTypes.number.isRequired,
  rowHeight: PropTypes.func.isRequired,
}

InfiniteAutoRowHeightList.defaultProps = {
  threshold: 15,
  overscanRowCount: 15,
  minimumBatchSize: 10,
}

export default InfiniteAutoRowHeightList
