import React, {PropTypes} from 'react'

export default function AdditionalAction(props) {
  const {
    onPrivacyChange,
    privacy,
    onDelete,
    classes
  } = props

  return (
    <ul className={classes.additionalActionsList}>
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
          onClick={onDelete}>
          Delete room
        </button>
      </li>
    </ul>
  )
}

AdditionalAction.propTypes = {
  onPrivacyChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  privacy: PropTypes.string.isRequired
}
