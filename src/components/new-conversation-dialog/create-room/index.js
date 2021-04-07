import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import debounce from 'lodash/debounce'
import {
  Flex,
  Switch,
  TextField,
  TextArea,
  TagsInput,
  Tag,
  Text,
  ButtonGroup,
  Button,
  Icon,
  Headline,
} from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'
import injectSheet from 'grape-web/lib/jss'

import { InfiniteAutoRowHeightList } from '../../list'
import RowRenderer from './RowRenderer'
import NoRowsRenderer from './NoRowsRenderer'

import theme from './theme'

const CreateRoom = ({
  classes,
  overflowPadding,
  members,
  selectedMembers,
  membersQuery,
  isMembersLoading,
  hideCreateRoom,
  setIsPrivate,
  onGroupNameChange,
  onGroupDescriptionChange,
  onChangeMembersQuery,
  onSearchMembers,
  onMemberSelect,
  onMemberRemove,
  onCreateRoom,
}) => {
  useEffect(() => {
    onSearchMembers()
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(members[index]), [
    members,
  ])

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      <div className={classes.backWrapper}>
        <a onClick={hideCreateRoom} href="#groups" className={classes.back}>
          <Icon name="arrowLeft" />
        </a>
        <Headline size="base">
          <FormattedMessage
            id="ncdCreateGroup"
            defaultMessage="Create a new group"
          />
        </Headline>
      </div>
      <Switch
        label={
          <FormattedMessage
            id="ncdGroupPrivateLabel"
            defaultMessage="Make group private"
            description="switch label"
          />
        }
        aria-label={
          <FormattedMessage
            id="ncdGroupPrivateLabel"
            defaultMessage="Make group private"
            description="switch label"
          />
        }
        onChange={setIsPrivate}
        className={classes.switch}
        helpText={
          <FormattedMessage
            id="ncdGroupPrivateHelpText"
            defaultMessage="Only group members can view a private group and invite other people to join."
            description="switch help text"
          />
        }
      />
      <TextField
        label={
          <FormattedMessage
            id="ncdGroupNameLabel"
            defaultMessage="Group name"
            description="text field label"
          />
        }
        onChange={onGroupNameChange}
        description={
          <FormattedMessage
            id="ncdGroupNameDescription"
            defaultMessage="Should represent the topic of the group."
            description="text field description"
          />
        }
        maxLength={30}
        width={410}
        className={classes.name}
      />
      <TextArea
        label={
          <FormattedMessage
            id="ncdGroupDescriptionLabel"
            defaultMessage="Description"
            description="text area label"
          />
        }
        onChange={onGroupDescriptionChange}
        description={
          <FormattedMessage
            id="ncdGroupDescriptionDescription"
            defaultMessage="Help others understand the purpose of this group."
            description="text area description"
          />
        }
        isNecessityLabel
        maxLength={120}
        className={classes.description}
      />
      <TagsInput
        label={
          <FormattedMessage
            id="ncdGroupMembersLabel"
            defaultMessage="Members"
            description="group members input label"
          />
        }
        onChange={debounce(
          query => onChangeMembersQuery(query),
          debouncingTime,
        )}
        description={
          <FormattedMessage
            id="ncdGroupMembersDescription"
            defaultMessage="Consider adding other people for lively discussions. You can also do this later."
            description="description for group members input"
          />
        }
        isNecessityLabel
        className={classes.members}
      >
        {selectedMembers.map(member => {
          const { id, firstName, avatar, lastName, displayName } = member
          const name =
            !firstName || !lastName ? displayName : `${firstName} ${lastName}`

          return (
            <Tag
              key={id}
              avatarSrc={avatar}
              avatarAlt={name}
              onRemove={() => {
                onMemberRemove(id)
              }}
            >
              {name}
            </Tag>
          )
        })}
      </TagsInput>
      <Text className={classes.selectedMembers} size="small">
        <FormattedMessage
          id="ncdGroupMembersSelected"
          defaultMessage="Selected members:"
        />
        &nbsp;
        <Text emphasis size="small">
          {selectedMembers.length}
        </Text>
      </Text>
      <div className={classes.listWrapper}>
        <div className={classes.list}>
          <InfiniteAutoRowHeightList
            rowHeight={() => 32}
            loadMoreRows={onSearchMembers}
            isRowLoaded={isRowLoaded}
            list={members}
            minimumBatchSize={50}
            width={680 - overflowPadding}
            threshold={25}
            rowRenderer={(index, key, style) => (
              <RowRenderer
                index={index}
                key={key}
                style={style}
                members={members}
                onMemberRemove={onMemberRemove}
                onMemberSelect={onMemberSelect}
                classes={classes}
              />
            )}
            noRowsRenderer={() => (
              <NoRowsRenderer
                classes={classes}
                membersQuery={membersQuery}
                isMembersLoading={isMembersLoading}
              />
            )}
          />
        </div>
      </div>
      <ButtonGroup className={classes.buttons}>
        <Button onClick={onCreateRoom} variant="primary">
          <FormattedMessage
            id="ncdGroupCreateButton"
            defaultMessage="Create group"
          />
        </Button>
        <Button onClick={hideCreateRoom} variant="basic" appearance="minimal">
          <FormattedMessage
            id="ncdGroupCreateCancelButton"
            defaultMessage="Cancel"
          />
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

export default injectSheet(theme)(CreateRoom)
