import React, { useEffect, useCallback, useRef } from 'react'
import cn from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import {
  Flex,
  Switch,
  TextField,
  TextArea,
  Tag,
  TagsInput,
  Text,
  ButtonGroup,
  Button,
  Icon,
  Headline,
  useFocusStyle,
} from '@ubergrape/aurora-ui'
import { debouncingTime } from 'grape-web/lib/constants/time'
import injectSheet from 'grape-web/lib/jss'

import { InfiniteAutoRowHeightList } from '../../list'
import RowRenderer from './RowRenderer'
import NoRowsRenderer from './NoRowsRenderer'

import theme from './theme'

const CreateGroup = ({
  classes,
  overflowPadding,
  members,
  selectedMembers,
  membersQuery,
  errorDetails,
  isPrivate,
  isMembersLoading,
  hideCreateGroup,
  setIsPrivate,
  isTagsInputInteracted,
  onGroupNameChange,
  onGroupDescriptionChange,
  onChangeMembersQuery,
  onSearchMembers,
  onMemberSelect,
  onMemberRemove,
  onCreateGroup,
  intl: { formatMessage },
}) => {
  const ref = useRef()

  useEffect(() => {
    // https://github.com/adobe/react-spectrum/issues/874
    document.querySelector('#new-conversation-dialog .os-viewport').focus()
  }, [])

  const isRowLoaded = useCallback(({ index }) => Boolean(members[index]), [
    members,
  ])

  const onTagsInputFocus = () => {
    if (!isTagsInputInteracted) {
      onSearchMembers()
    }
  }

  const onSubmit = () => {
    ref.current.reportValidity()
    onCreateGroup()
  }

  const { onFocusVisible } = useFocusStyle({ isInvalid: false })

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      <div className={classes.backWrapper}>
        <a
          aria-label="Go back to groups tab"
          onClick={hideCreateGroup}
          href="#new-conversation"
          className={cn(classes.back, onFocusVisible)}
        >
          <Icon name="arrowLeft" />
        </a>
        <Headline size="base">
          <FormattedMessage
            id="ncdCreateGroup"
            defaultMessage="Create a new group"
          />
        </Headline>
      </div>
      <form ref={ref} className={classes.form}>
        <Switch
          label={formatMessage({
            id: 'ncdGroupPrivateLabel',
            defaultMessage: 'Make group private',
            description: 'switch label',
          })}
          aria-label={formatMessage({
            id: 'ncdGroupPrivateLabel',
            defaultMessage: 'Make group private',
            description: 'switch label',
          })}
          isSelected={isPrivate}
          onChange={setIsPrivate}
          className={classes.switch}
          helpText={formatMessage({
            id: 'ncdGroupPrivateHelpText',
            defaultMessage:
              'Only group members can view a private group and invite other people to join.',
            description: 'switch help text',
          })}
          isChecked={isPrivate}
        />
        <TextField
          label={formatMessage({
            id: 'ncdGroupNameLabel',
            defaultMessage: 'Group name',
            description: 'text field label',
          })}
          onChange={onGroupNameChange}
          {...(errorDetails.name && {
            validationHelp: errorDetails.name[0].message,
          })}
          description={formatMessage({
            id: 'ncdGroupNameDescription',
            defaultMessage: 'Should represent the topic of the group.',
            description: 'text field description',
          })}
          maxLength={30}
          width={410}
          className={classes.name}
        />
        <TextArea
          label={formatMessage({
            id: 'ncdGroupDescriptionLabel',
            defaultMessage: 'Description',
            description: 'text area label',
          })}
          onChange={onGroupDescriptionChange}
          description={formatMessage({
            id: 'ncdGroupDescriptionDescription',
            defaultMessage: 'Help others understand the purpose of this group.',
            description: 'text area description',
          })}
          {...(errorDetails.description && {
            validationHelp: errorDetails.description[0].message,
          })}
          isNecessityLabel
          maxLength={120}
          className={classes.description}
        />
        <TagsInput
          label={formatMessage({
            id: 'ncdGroupMembersLabel',
            defaultMessage: 'Members',
            description: 'group members input label',
          })}
          onChange={debounce(
            query => onChangeMembersQuery(query),
            debouncingTime,
          )}
          description={formatMessage({
            id: 'ncdGroupMembersDescription',
            defaultMessage:
              'Consider adding other people for lively discussions. You can also do this later.',
            description: 'description for group members input',
          })}
          maxHeight={67}
          onFocus={onTagsInputFocus}
          onRemove={onMemberRemove}
          isNecessityLabel
          className={classes.members}
        >
          {selectedMembers.map(member => {
            const { id, avatar, displayName } = member

            return (
              <Tag key={id} id={id} avatarSrc={avatar} avatarAlt={displayName}>
                {displayName}
              </Tag>
            )
          })}
        </TagsInput>
        <div className={classes.membersListWrapper}>
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
                overscanRowCount={10}
                rowRenderer={({ index, key, style, isVisible }) => (
                  <RowRenderer
                    index={index}
                    key={key}
                    style={style}
                    isVisible={isVisible}
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
        </div>
        <ButtonGroup className={classes.buttons}>
          <Button onClick={onSubmit} variant="primary">
            <FormattedMessage
              id="ncdGroupCreateButton"
              defaultMessage="Create group"
            />
          </Button>
          <Button
            onClick={hideCreateGroup}
            variant="basic"
            appearance="minimal"
          >
            <FormattedMessage
              id="ncdGroupCreateCancelButton"
              defaultMessage="Cancel"
            />
          </Button>
        </ButtonGroup>
      </form>
    </Flex>
  )
}

export default injectSheet(theme)(injectIntl(CreateGroup))
