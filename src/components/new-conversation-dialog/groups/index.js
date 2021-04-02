import React, { useCallback, useEffect } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import { Text, ActionLink, Flex, SearchField } from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRenderer from './NoRowsRenderer'

import theme from './theme'
import RowRenderer from './RowRenderer'

const rowHeight = (list, index) => {
  if (list[index].text) return 62
  return 40
}

const Groups = ({
  classes,
  overflowPadding,
  groups,
  isGroupsLoading,
  isMemberOfEachGroup,
  isMemberOfAnyGroups,
  onChangeGroupsQuery,
  onSearchGroups,
  hideNewConversation,
  showCreateRoom,
  goToChannel,
  joinChannel,
}) => {
  useEffect(() => {
    onSearchGroups()
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(groups[index]), [
    groups,
  ])

  const onListItemClick = (id, membership) => {
    hideNewConversation()

    if (membership) {
      goToChannel(id)
      return
    }

    joinChannel(id)
  }

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
        <ActionLink
          variant="primary"
          onClick={showCreateRoom}
          className={classes.link}
          href="#create-room"
          icon="people"
        >
          Create a new group
        </ActionLink>
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
        onClick={showCreateRoom}
        className={classes.link}
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
        onChange={debounce(query => onChangeGroupsQuery(query), debouncingTime)}
        label="Group search"
        className={classes.search}
        placeholder="Search for a group ..."
      />
      <div className={classes.listWrapper}>
        <div className={classes.list}>
          <InfiniteAutoRowHeightList
            rowHeight={rowHeight}
            loadMoreRows={onSearchGroups}
            isListLoading={isGroupsLoading}
            isRowLoaded={isRowLoaded}
            list={groups}
            minimumBatchSize={50}
            width={680 - overflowPadding}
            threshold={25}
            overscanRowCount={25}
            rowRenderer={(index, key, style) => (
              <RowRenderer
                index={index}
                key={key}
                style={style}
                classes={classes}
                groups={groups}
                onListItemClick={onListItemClick}
              />
            )}
            noRowsRenderer={() => (
              <NoRowsRenderer
                classes={classes}
                isGroupsLoading={isGroupsLoading}
              />
            )}
          />
        </div>
      </div>
    </Flex>
  )
}

export default injectSheet(theme)(Groups)
