import PropTypes from 'prop-types'
import React from 'react'
import { defineMessages, intlShape } from 'react-intl'

const messages = defineMessages({
  makePrivate: {
    id: 'makeGroupPrivate',
    defaultMessage: 'Make group private',
  },
  makePublic: {
    id: 'makeGroupPublic',
    defaultMessage: 'Make group public',
  },
  deleteGroup: {
    id: 'deleteGroup',
    defaultMessage: 'Delete group',
  },
})

export default function AdditionalActions(props) {
  const {
    onChangePrivacy,
    onDeleteClick,
    allowDelete,
    privacy,
    classes,
    intl: { formatMessage },
  } = props

  return (
    <ul>
      <li>
        <button
          className={classes.additionalActionButton}
          onClick={onChangePrivacy}
        >
          {formatMessage(
            messages[privacy === 'private' ? 'makePrivate' : 'makePublic'],
          )}
        </button>
      </li>
      {allowDelete && (
        <li>
          <button
            className={`${classes.additionalActionButton} ${classes.deleteRoomButton}`}
            onClick={onDeleteClick}
          >
            {formatMessage(messages.deleteGroup)}
          </button>
        </li>
      )}
    </ul>
  )
}

AdditionalActions.propTypes = {
  onChangePrivacy: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  allowDelete: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  privacy: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
}
