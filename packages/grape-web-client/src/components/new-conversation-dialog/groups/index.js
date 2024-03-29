import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import { Text, ActionLink, Flex, SearchField } from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'

import conf from '../../../conf'
import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRenderer from './NoRowsRenderer'

import theme from './theme'
import RowRenderer from './RowRenderer'

const rowHeight = (list, index) => {
  if (list[index].isSeparator) return 62
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
  showCreateGroup,
  goToChannel,
  joinChannel,
  user,
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
    showCreateGroup(org.defaults?.groupDefaults?.visibility === 'private')
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
    if (user.role === conf.constants.roles.ROLE_GUEST) {
      return (
        <Flex direction="column" className={classes.noMemberGuest}>
          <Text maxWidth="initial" emphasis>
            <FormattedMessage
              id="ncdNoGroupsGuest1"
              defaultMessage="You are not part of any group!"
              description="shown for guest user when there are no groups in the organisation"
            />
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            <FormattedMessage
              id="ncdNoGroupsGuest2"
              defaultMessage="It seems that you do not have access to any groups yet and your user role does not allow you to create new ones. Please wait until you get added to a group."
              description="shown for guest user when there are no groups in the organisation"
            />
          </Text>
        </Flex>
      )
    }

    return (
      <Flex direction="column" items="start" className={classes.wrapper}>
        <Flex direction="column" className={classes.noMember}>
          <Text maxWidth="initial" emphasis>
            <FormattedMessage
              id="ncdNoGroups1"
              defaultMessage="You're the first!"
              description="shown when there are no groups in the organisation"
            />
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            <FormattedMessage
              id="ncdNoGroups2"
              defaultMessage="No one else has created a group yet. Don't be too stressed and just create the first group around a topic that comes to your mind. You can invite other people to this group later."
              description="shown when there are no groups in the organisation"
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
      {org.permissions.canCreateRoom ? (
        <>
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
        </>
      ) : (
        <Text maxWidth="initial" className={classes.header}>
          <FormattedMessage
            id="ncdJoinButDontCreateGroupHeader"
            defaultMessage="You can see all groups which you have access to. Your user role does not allow you to create groups."
          />
        </Text>
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
            overscanRowCount={10}
            rowRenderer={({ index, key, style, isVisible }) => (
              <RowRenderer
                index={index}
                key={key}
                style={style}
                isVisible={isVisible}
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
