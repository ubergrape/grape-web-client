import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
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
  isNoOtherGroups,
  onChangeGroupsQuery,
  onSearchGroups,
  hideNewConversation,
  showCreateRoom,
  goToChannel,
  joinChannel,
  org,
  intl: { formatMessage },
}) => {
  useEffect(() => {
    onSearchGroups()
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(groups[index]), [
    groups,
  ])

  const onCreateGroupClick = () => {
    showCreateRoom(org.defaults?.groupDefaults?.visibility === 'private')
  }

  const onListItemClick = (id, membership) => {
    hideNewConversation()

    if (membership) {
      goToChannel(id)
      return
    }

    joinChannel(id)
  }

  if (isNoOtherGroups) {
    return (
      <Flex direction="column" items="start" className={classes.wrapper}>
        <Flex direction="column" className={classes.empty}>
          <Text maxWidth="initial" emphasis>
            <FormattedMessage
              id="ncdNoGroups1"
              defaultMessage="You're the first!"
            />
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            <FormattedMessage
              id="ncdNoGroups2"
              defaultMessage="No one else has created a group yet. Don't be too stressed and just create the first group around a topic that comes to your mind. You can invite other people to this group later."
            />
          </Text>
        </Flex>
        <ActionLink
          variant="primary"
          onClick={onCreateGroupClick}
          className={classes.link}
          href="#create-room"
          icon="people"
          title={formatMessage({
            id: 'ncdCreateGroup',
            defaultMessage: 'Create a new group',
          })}
        />
      </Flex>
    )
  }

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      <Text maxWidth="initial" className={classes.header}>
        <FormattedMessage
          id="ncdJoinGroupHeader"
          defaultMessage="Join an existing group or create a new one. Groups are best organized around a topic."
        />
      </Text>
      <ActionLink
        variant="primary"
        onClick={onCreateGroupClick}
        className={classes.link}
        href="#create-room"
        icon="people"
        title={formatMessage({
          id: 'ncdCreateGroup',
          defaultMessage: 'Create a new group',
        })}
      />
      {isMemberOfEachGroup && (
        <Flex direction="column" className={classes.member}>
          <Text maxWidth="initial" emphasis>
            <FormattedMessage
              id="ncdMemberOfEachGroup1"
              defaultMessage="You won't miss any chat going on!"
            />
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            <FormattedMessage
              id="ncdMemberOfEachGroup2"
              defaultMessage="You're already part of every existing group here, there is nothing that can be publicly said without your notice. You may want to conversations going."
            />
          </Text>
        </Flex>
      )}
      <SearchField
        onChange={debounce(query => onChangeGroupsQuery(query), debouncingTime)}
        label={formatMessage({
          id: 'ncdGroupSearchLabel',
          defaultMessage: 'Group search',
        })}
        className={classes.search}
        placeholder={formatMessage({
          id: 'ncdGroupSearchPlaceholder',
          defaultMessage: 'Search for a group ...',
        })}
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
            rowRenderer={({ index, key, style }) => (
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

export default injectSheet(theme)(injectIntl(Groups))
