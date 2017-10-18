import React from 'react'
import {defineMessages} from 'react-intl'

import {maxChannelDescriptionLength} from '../../../constants/app'
import {Description as DescriptionText} from '../../i18n'
import EditableText from '../../editable-text/EditableText'

const messages = defineMessages({
  placeholder: {
    id: 'addGroupDescription',
    defaultMessage: 'Add a group description here…'
  }
})

const Editable = ({allowEdit, description, intl: {formatMessage}, onSetRoomDescription}) => {
  if (!allowEdit) return <p>{description}</p>

  return (
    <EditableText
      placeholder={formatMessage(messages.placeholder)}
      maxLength={maxChannelDescriptionLength}
      onSave={onSetRoomDescription}
      value={description}
      preserveSpaceForButton
      multiline
    />
  )
}

export default ({classes, allowEdit, description, ...rest}) => {
  if (!allowEdit && !description) return null

  return (
    <article className={classes.roomDescription}>
      <h2 className={classes.title}>
        <DescriptionText />
      </h2>
      <Editable
        allowEdit={allowEdit}
        description={description}
        {...rest}
      />
    </article>
  )
}
