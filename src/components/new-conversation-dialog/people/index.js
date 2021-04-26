import React, { useCallback, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'

import { Text, ActionLink, Flex, SearchField } from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InfiniteAutoRowHeightKeyStepperList } from '../../list'
import NoRowsRenderer from './NoRowsRenderer'
import theme from './theme'
import Separator from './Separator'
import RowRenderer from './RowRenderer'
import RowRendererScrolling from './RowRendererScrolling'

const rowHeight = (list, index) => {
  if (list[index].text) return 62
  return 40
}

const People = ({
  classes,
  overflowPadding,
  people,
  isPeopleLoading,
  isInPmWithEveryPerson,
  isNoOtherPerson,
  onChangePeopleQuery,
  onSearchPeople,
  hideNewConversation,
  goToChannel,
  openPm,
  org,
  showInviteToOrg,
  intl: { formatMessage },
}) => {
  useEffect(() => {
    if (!people.length) {
      onSearchPeople()
    }
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(people[index]), [
    people,
  ])

  const onInviteToOrgClick = () => {
    hideNewConversation()
    showInviteToOrg()
  }

  const onListItemClick = (id, pm) => {
    hideNewConversation()

    if (pm) {
      goToChannel(pm)
      return
    }

    openPm(id)
  }

  if (isNoOtherPerson) {
    return (
      <Flex direction="column" className={classes.member}>
        <Text maxWidth="initial" emphasis>
          <FormattedMessage
            id="ncdPeopleSearchNoOtherPeople1"
            defaultMessage="Feeling lonely here?"
            description="shown when there are no people in the organisation"
          />
        </Text>
        <Text maxWidth="initial" className={classes.description}>
          <FormattedMessage
            id="ncdPeopleSearchNoOtherPeople2"
            defaultMessage="It seems that {organizationName} has no other member than you yet, so why not invite someone? As soon as they join, you can come back and start a conversation."
            description="shown when there are no people in the organisation"
            values={{ organizationName: org.name }}
          />
        </Text>
        <ActionLink
          variant="primary"
          onClick={onInviteToOrgClick}
          className={classes.link}
          href="#invite-to-organization"
          icon="people"
          title={formatMessage({
            id: 'ncdInviteToOrga',
            defaultMessage: 'Invite members to {organizationName}',
            description: 'Action link title, shown when there a no members',
            values: { organizationName: org.name },
          })}
        />
      </Flex>
    )
  }

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      {isInPmWithEveryPerson && !!people.length && (
        <Flex direction="column" className={classes.member}>
          <Text maxWidth="initial" emphasis>
            <FormattedMessage
              id="ncdInPmWithEveryPerson1"
              defaultMessage="You're a very communicative person!"
            />
          </Text>
          <Text maxWidth="initial" className={classes.description}>
            <FormattedMessage
              id="ncdInPmWithEveryPerson2"
              defaultMessage="All members are already chatting with you. Keep in touch with them."
            />
          </Text>
        </Flex>
      )}
      <SearchField
        onChange={debounce(query => onChangePeopleQuery(query), debouncingTime)}
        aria-label={formatMessage({
          id: 'ncdPersonSearchLabel',
          defaultMessage: 'Person search',
        })}
        className={classes.search}
        placeholder={formatMessage({
          id: 'ncdPersonSearchPlaceholder',
          defaultMessage: 'Search for a person ...',
        })}
      />
      <div className={classes.listWrapper}>
        <div className={classes.list}>
          <InfiniteAutoRowHeightKeyStepperList
            rowHeight={rowHeight}
            loadMoreRows={onSearchPeople}
            isListLoading={isPeopleLoading}
            isRowLoaded={isRowLoaded}
            list={people}
            minimumBatchSize={50}
            width={680 - overflowPadding}
            threshold={25}
            overscanRowCount={25}
            rowRenderer={({ index, key, style, isScrolling }) => {
              // Separator for list blocks with people with existing conversation and without
              if (people[index].isSeparator) {
                return (
                  <Separator
                    key={key}
                    people={people}
                    index={index}
                    style={style}
                    classes={classes}
                  />
                )
              }

              if (isScrolling) {
                return (
                  <RowRendererScrolling
                    index={index}
                    key={key}
                    style={style}
                    classes={classes}
                    people={people}
                  />
                )
              }

              return (
                <RowRenderer
                  index={index}
                  key={key}
                  style={style}
                  classes={classes}
                  people={people}
                  onListItemClick={onListItemClick}
                />
              )
            }}
            noRowsRenderer={() => (
              <NoRowsRenderer
                classes={classes}
                orgName={org.name}
                isPeopleLoading={isPeopleLoading}
              />
            )}
          />
        </div>
      </div>
    </Flex>
  )
}

export default injectSheet(theme)(injectIntl(People))
