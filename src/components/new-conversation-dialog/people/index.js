import React, { useCallback, useEffect } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'

import { Flex, SearchField } from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRenderer from './NoRowsRenderer'
import theme from './theme'
import RowRenderer from './RowRenderer'

const rowHeight = (list, index) => {
  if (list[index].text) return 62
  return 40
}

const People = ({
  classes,
  overflowPadding,
  people,
  isPeopleLoading,
  // isInPmWithEveryPerson,
  onChangePeopleQuery,
  onSearchPeople,
  hideNewConversation,
  goToChannel,
  openPm,
}) => {
  useEffect(() => {
    onSearchPeople()
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(people[index]), [
    people,
  ])

  const onListItemClick = (id, pm) => {
    hideNewConversation()

    if (pm) {
      goToChannel(id)
      return
    }

    openPm(id)
  }

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      <SearchField
        onChange={debounce(query => onChangePeopleQuery(query), debouncingTime)}
        aria-label="Person search"
        className={classes.search}
        placeholder="Search for a person ..."
      />
      <div className={classes.listWrapper}>
        <div className={classes.list}>
          <InfiniteAutoRowHeightList
            rowHeight={rowHeight}
            loadMoreRows={onSearchPeople}
            isRowLoaded={isRowLoaded}
            list={people}
            minimumBatchSize={50}
            width={680 - overflowPadding}
            threshold={25}
            rowRenderer={(index, key, style) => (
              <RowRenderer
                index={index}
                key={key}
                style={style}
                classes={classes}
                people={people}
                onListItemClick={onListItemClick}
              />
            )}
            noRowsRenderer={() => (
              <NoRowsRenderer
                classes={classes}
                isPeopleLoading={isPeopleLoading}
              />
            )}
          />
        </div>
      </div>
    </Flex>
  )
}

export default injectSheet(theme)(People)