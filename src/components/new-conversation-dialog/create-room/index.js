import React, { useEffect, useCallback, useRef } from 'react'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import {
  Flex,
  Switch,
  TextField,
  TextArea,
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

const CreateRoom = ({
  classes,
  overflowPadding,
  members,
  selectedMembers,
  membersQuery,
  errorMessage,
  currentSelectedMember,
  isMembersLoading,
  hideCreateRoom,
  setIsPrivate,
  isTagsInputInteracted,
  onGroupNameChange,
  onGroupDescriptionChange,
  onChangeMembersQuery,
  onCurrentSelectedMemberChange,
  onSearchMembers,
  onMemberSelect,
  onMemberRemove,
  onCreateRoom,
}) => {
  const ref = useRef()

  useEffect(() => {
    // https://github.com/adobe/react-spectrum/issues/874
    document
      .querySelector('[aria-labelledby="New conversation"] .os-viewport')
      .focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = e => {
      if (document.activeElement.classList.contains('ReactVirtualized__List')) {
        if (e.keyCode === 13) {
          const { id, isSelected } = members[currentSelectedMember]
          if (isSelected) {
            onMemberRemove(id)
          } else {
            onMemberSelect(id)
          }
        }
      }
    }

    document
      .querySelector(
        '[aria-labelledby="New conversation"] .ReactVirtualized__List',
      )
      .addEventListener('keydown', handleKeyDown)

    return () => {
      document
        .querySelector(
          '[aria-labelledby="New conversation"] .ReactVirtualized__List',
        )
        .removeEventListener('keydown', handleKeyDown)
    }
  }, [members, currentSelectedMember])

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
    onCreateRoom()
  }

  const { focus, onFocusVisible } = useFocusStyle({ isInvalid: false })

  return (
    <Flex direction="column" items="start" className={classes.wrapper}>
      <div className={classes.backWrapper}>
        <a
          onClick={hideCreateRoom}
          href="#groups"
          className={cn(classes.back, onFocusVisible)}
        >
          <Icon name="arrowLeft" />
        </a>
        <Headline size="base">Create a new group</Headline>
      </div>
      <form ref={ref} className={classes.form}>
        <Switch
          label="Make group private"
          aria-label="Make group private"
          onChange={setIsPrivate}
          className={classes.switch}
          helpText="Only group members can view a private group and invite other people to join."
        />
        <TextField
          label="Group name"
          onChange={onGroupNameChange}
          description="Should represent the topic of the group."
          validationHelp={errorMessage}
          maxLength={30}
          isRequired
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
          maxHeight={67}
          tags={selectedMembers}
          onFocus={onTagsInputFocus}
          onRemove={onMemberRemove}
          description="Consider adding other people for lively discussions. You can also do this later."
          isNecessityLabel
          className={classes.members}
        />
        <div className={classes.membersListWrapper}>
          <Text className={classes.selectedMembers} size="small">
            Selected members:&nbsp;
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
                overscanRowCount={25}
                isKeyboardNavigationEnabled
                rowRenderer={({ index, key, style, scrollToRow }) => {
                  if (scrollToRow !== currentSelectedMember) {
                    onCurrentSelectedMemberChange(scrollToRow)
                  }

                  return (
                    <RowRenderer
                      index={index}
                      key={key}
                      style={style}
                      members={members}
                      onMemberRemove={onMemberRemove}
                      onMemberSelect={onMemberSelect}
                      classes={classes}
                      {...(scrollToRow === index && {
                        className: focus,
                      })}
                    />
                  )
                }}
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
            Create group
          </Button>
          <Button onClick={hideCreateRoom} variant="basic" appearance="minimal">
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </Flex>
  )
}

export default injectSheet(theme)(CreateRoom)
