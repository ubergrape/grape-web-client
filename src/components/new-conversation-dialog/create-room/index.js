import React from 'react'
import {
  Flex,
  Button,
  ActionLink,
  Switch,
  TextField,
  TextArea,
  TagsInput,
} from '@ubergrape/aurora-ui'
import injectSheet from 'grape-web/lib/jss'

import theme from './theme'

const CreateRoom = ({ hideCreateRoom, classes }) => {
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
        className={classes.switch}
        helpText="Only group members can view a private group and invite other people to join."
      />
      <TextField
        label="Group name"
        description="Should represent the topic of the group."
        maxLength={30}
        width={260}
        className={classes.name}
      />
      <TextArea
        label="Description"
        description="Help others understand the purpose of this group."
        isNecessityLabel
        maxLength={120}
        className={classes.description}
      />
      <TagsInput
        label="Members"
        description="Consider adding other people for lively discussions. You can also do this later."
        isNecessityLabel
        className={classes.members}
      />
      <Flex className={classes.buttons}>
        <Button variant="primary">Create group</Button>
        <Button
          className={classes.cancel}
          onClick={hideCreateRoom}
          variant="basic"
          appearance="minimal"
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  )
}

export default injectSheet(theme)(CreateRoom)
