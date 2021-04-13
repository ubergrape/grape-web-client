import React, { memo } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import {
  AutoSizer,
  InfiniteLoader,
  ArrowKeyStepper,
  List,
} from 'react-virtualized'

const InfiniteAutoRowHeightList = memo(
  ({
    isRowLoaded,
    loadMoreRows,
    rowRenderer,
    noRowsRenderer,
    isKeyboardNavigationEnabled,
    list,
    threshold,
    overscanRowCount,
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
            <ArrowKeyStepper
              disabled={!isKeyboardNavigationEnabled}
              mode="cells"
              columnCount={1}
              rowCount={list.length}
            >
              {({ onSectionRendered, scrollToRow }) => (
                <List
                  ref={registerChild}
                  width={width}
                  height={height}
                  {...(isKeyboardNavigationEnabled && {
                    scrollToIndex: scrollToRow,
                  })}
                  {...(isKeyboardNavigationEnabled && {
                    onSectionRendered,
                  })}
                  rowHeight={({ index }) => rowHeight(list, index)}
                  rowCount={list.length}
                  overscanRowCount={overscanRowCount}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={({ index, key, style }) =>
                    rowRenderer({ index, key, style, scrollToRow })
                  }
                  noRowsRenderer={noRowsRenderer}
                />
              )}
            </ArrowKeyStepper>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  ),
  (prevProps, nextProps) =>
    isEqual(prevProps.list, nextProps.list) &&
    prevProps.isListLoading === nextProps.isListLoading,
)

InfiniteAutoRowHeightList.propTypes = {
  isRowLoaded: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  noRowsRenderer: PropTypes.func.isRequired,
  isKeyboardNavigationEnabled: PropTypes.bool,
  list: PropTypes.array.isRequired,
  threshold: PropTypes.number,
  overscanRowCount: PropTypes.number,
  minimumBatchSize: PropTypes.number,
  width: PropTypes.number.isRequired,
  rowHeight: PropTypes.func.isRequired,
}

InfiniteAutoRowHeightList.defaultProps = {
  isKeyboardNavigationEnabled: false,
  threshold: 15,
  overscanRowCount: 15,
  minimumBatchSize: 10,
}

export default InfiniteAutoRowHeightList
