import React, {PropTypes} from 'react'
import {
  defineMessages,
  intlShape
} from 'react-intl'

const messages = defineMessages({
  makePrivate: {
    id: 'makeRoomPrivate',
    defaultMessage: 'Make room private'
  },
  makePublic: {
    id: 'makeRoomPublic',
    defaultMessage: 'Make room public'
  },
  deleteRoom: {
    id: 'deleteRoom',
    defaultMessage: 'Delete room'
  }
})

export default function AdditionalActions(props) {
  const {
    onChangePrivacy,
    onDeleteClick,
    privacy,
    theme: {classes},
    intl: {formatMessage}
  } = props

  return (
    <ul>
      <li>
        <button
          className={classes.additionalActionButton}
          onClick={onChangePrivacy}>
          {formatMessage(messages[privacy === 'private' ? 'makePrivate' : 'makePublic'])}
        </button>
      </li>
      <li>
        <button
          className={`${classes.additionalActionButton} ${classes.deleteRoomButton}`}
          onClick={onDeleteClick}>
          {formatMessage(messages.deleteRoom)}
        </button>
      </li>
    </ul>
  )
}

AdditionalActions.propTypes = {
  onChangePrivacy: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  privacy: PropTypes.string.isRequired,
  intl: intlShape.isRequired
}
