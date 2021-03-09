import React from 'react'
import PropTypes from 'prop-types'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

const InfiniteAutoRowHeightList = ({
  isRowLoaded,
  loadMoreRows,
  rowRenderer,
  noRowsRenderer,
  list,
  threshold,
  minimumBatchSize,
  width,
  rowHeight,
}) => (
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
            onRowsRendered={onRowsRendered}
            rowRenderer={({ index, key, style }) =>
              rowRenderer(index, key, style)
            }
            noRowsRenderer={noRowsRenderer}
          />
        )}
      </AutoSizer>
    )}
  </InfiniteLoader>
)

InfiniteAutoRowHeightList.propTypes = {
  isRowLoaded: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  noRowsRenderer: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  threshold: PropTypes.number,
  minimumBatchSize: PropTypes.number,
  width: PropTypes.number.isRequired,
  rowHeight: PropTypes.func.isRequired,
}

InfiniteAutoRowHeightList.defaultProps = {
  threshold: 15,
  minimumBatchSize: 10,
}

export default InfiniteAutoRowHeightList
