import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import {
  AutoSizer,
  InfiniteLoader,
  ArrowKeyStepper,
  List,
} from 'react-virtualized'

const InfiniteAutoRowHeightKeyStepperList = memo(
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
  }) => {
    const [scrollToSelectedRow, setScrollToSelectedRow] = useState(0)
    const [isScrollUsed, setScrollUsed] = useState(false)

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
              <ArrowKeyStepper
                disabled={!isKeyboardNavigationEnabled}
                mode="cells"
                columnCount={1}
                rowCount={list.length}
                isControlled
                onScrollToChange={({ scrollToRow }) => {
                  setScrollUsed(false)
                  if (scrollToRow !== scrollToSelectedRow) {
                    setScrollToSelectedRow(scrollToRow)
                  }
                }}
                scrollToRow={scrollToSelectedRow}
              >
                {() => (
                  <List
                    ref={registerChild}
                    width={width}
                    height={height}
                    {...(isKeyboardNavigationEnabled &&
                      !isScrollUsed && {
                        scrollToIndex: scrollToSelectedRow,
                      })}
                    rowHeight={({ index }) => rowHeight(list, index)}
                    rowCount={list.length}
                    overscanRowCount={overscanRowCount}
                    onRowsRendered={onRowsRendered}
                    onScroll={() => {
                      if (!isScrollUsed) setScrollUsed(true)
                    }}
                    rowRenderer={({ index, key, style, isScrolling }) =>
                      rowRenderer({
                        index,
                        key,
                        style,
                        isScrolling,
                        scrollToRow: scrollToSelectedRow,
                      })
                    }
                    noRowsRenderer={noRowsRenderer}
                  />
                )}
              </ArrowKeyStepper>
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

InfiniteAutoRowHeightKeyStepperList.propTypes = {
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

InfiniteAutoRowHeightKeyStepperList.defaultProps = {
  isKeyboardNavigationEnabled: false,
  threshold: 15,
  overscanRowCount: 15,
  minimumBatchSize: 10,
}

export default InfiniteAutoRowHeightKeyStepperList
