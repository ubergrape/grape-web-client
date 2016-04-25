import React, {PropTypes} from 'react'

export default function AdditionalActions(props) {
  const {
    onPrivacyChange,
    privacy,
    onDeleteClick,
    classes
  } = props

  return (
    <ul>
      <li>
        <button
          className={classes.additionalActionButton}
          onClick={onPrivacyChange}>
          Make room {privacy}
        </button>
      </li>
      <li>
        <button
          className={`${classes.additionalActionButton} ${classes.deleteRoomButton}`}
          onClick={onDeleteClick}>
          Delete room
        </button>
      </li>
    </ul>
  )
}

AdditionalActions.propTypes = {
  onPrivacyChange: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  privacy: PropTypes.string.isRequired
}
