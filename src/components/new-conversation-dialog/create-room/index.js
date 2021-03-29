import React, { useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'
import {
  Flex,
  ActionLink,
  Switch,
  TextField,
  TextArea,
  TagsInput,
  Tag,
  Text,
  ButtonGroup,
  Button,
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
      <ActionLink
        className={classes.link}
        variant="basic"
        onClick={hideCreateRoom}
        href="#"
        icon="arrowLeft"
      >
        Create a new group
      </ActionLink>
      <Switch
        label="Make group private"
        onChange={setIsPrivate}
        className={classes.switch}
        helpText="Only group members can view a private group and invite other people to join."
      />
      <TextField
        label="Group name"
        onChange={onGroupNameChange}
        description="Should represent the topic of the group."
        maxLength={30}
        width={260}
        className={classes.name}
      />
      <TextArea
        label="Description"
        onChange={onGroupDescriptionChange}
        description="Help others understand the purpose of this group."
        isNecessityLabel
        maxLength={120}
        className={classes.description}
      />
      <TagsInput
        label="Members"
        onChange={debounce(
          query => onChangeMembersQuery(query),
          debouncingTime,
        )}
        description="Consider adding other people for lively discussions. You can also do this later."
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
      <Text className={classes.selectedMembers}>
        Selected members:&nbsp;<Text emphasis>{selectedMembers.length}</Text>
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
          Create group
        </Button>
        <Button onClick={hideCreateRoom} variant="basic" appearance="minimal">
          Cancel
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

export default injectSheet(theme)(CreateRoom)