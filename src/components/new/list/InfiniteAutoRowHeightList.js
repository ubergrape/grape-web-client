import React from 'react'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

const InfiniteAutoRowHeightList = props => (
  <InfiniteLoader
    isRowLoaded={({ index }) => props.isRowLoaded(index)}
    loadMoreRows={props.loadMoreRows}
    rowCount={props.list.length + (props.threshold || 15)}
    minimumBatchSize={props.minimumBatchSize || 10}
    threshold={props.threshold || 15}
  >
    {({ onRowsRendered, registerChild }) => (
      <AutoSizer disableWidth>
        {({ height }) => (
          <List
            ref={registerChild}
            width={props.width}
            height={height}
            rowHeight={({ index }) => props.rowHeight(props.list, index)}
            rowCount={props.list.length}
            onRowsRendered={onRowsRendered}
            rowRenderer={({ index, key, style }) =>
              props.rowRenderer(index, key, style)
            }
            noRowsRenderer={props.noRowsRenderer}
          />
        )}
      </AutoSizer>
    )}
  </InfiniteLoader>
)

export default InfiniteAutoRowHeightList
