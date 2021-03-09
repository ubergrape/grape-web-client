import React, { useCallback, useEffect } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import {
  Text,
  ActionLink,
  Button,
  Flex,
  SearchField,
} from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'

import InfiniteAutoRowHeightList from '../InfiniteAutoRowHeightList'
import NoRowsRenderer from './NoRowsRenderer'

import theme from './theme'

const rowHeight = (list, index) => {
  if (list[index].text) return 70
  return 40
}

const Groups = ({
  groups,
  isGroupsLoading,
  isMemberOfEachGroup,
  isMemberOfAnyGroups,
  onChangeGroupsQuery,
  onSearchGroups,
  overflowPadding,
  classes,
}) => {
  useEffect(() => {
    onSearchGroups()
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(groups[index]), [
    groups,
  ])

  if (!isMemberOfAnyGroups) {
    return (
      <Flex direction="column" items="start" className={classes.wrapper}>
        <Flex direction="column" className={classes.empty}>
          <Text maxWidth="initial" emphasis>
            You’re the first!
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            No one else has created a group yet. Don&#39;t be too stressed and
            just create the first group around a topic that comes to your mind.
            You can invite other people to this group later.
          </Text>
        </Flex>
        <Button
          className={classes.button}
          icon="people"
          appearance="minimal"
          variant="basic"
        >
          Create a new group
        </Button>
      </Flex>
    )
  }

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      <Text maxWidth="initial" className={classes.header}>
        Join an existing group or create a new one. Groups are best organized
        around a topic.
      </Text>
      <ActionLink
        variant="primary"
        className={classes.button}
        href="#"
        icon="people"
      >
        Create a new group
      </ActionLink>
      {isMemberOfEachGroup && (
        <Flex direction="column" className={classes.member}>
          <Text maxWidth="initial" emphasis>
            You won&#39;t miss any chat going on!
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            You&#39;re already part of every existing group here, there is
            nothing that can be publicly said without your notice. You may want
            to conversations going.
          </Text>
        </Flex>
      )}
      <SearchField
        onChange={debounce(query => {
          onChangeGroupsQuery(query)
        }, debouncingTime)}
        label="Group search"
        className={classes.search}
        placeholder="Search for a group ..."
      />
      <div style={{ flex: 1 }}>
        <div style={{ height: 'calc(100% - 1px)' }}>
          <InfiniteAutoRowHeightList
            rowHeight={rowHeight}
            loadMoreRows={onSearchGroups}
            isRowLoaded={isRowLoaded}
            list={groups}
            minimumBatchSize={50}
            width={680 - overflowPadding}
            threshold={30}
            rowRenderer={(index, key, style) => {
              if (groups[index].text) {
                return (
                  <div key={groups[index].text} style={style}>
                    <span style={{ fontWeight: 900 }}>
                      {groups[index].text}
                    </span>
                  </div>
                )
              }

              return (
                <div key={groups[index].id} style={style}>
                  {groups[index].name}
                </div>
              )
            }}
            noRowsRenderer={() => (
              <NoRowsRenderer isGroupsLoading={isGroupsLoading} />
            )}
          />
        </div>
      </div>
    </Flex>
  )
}

export default injectSheet(theme)(Groups)
