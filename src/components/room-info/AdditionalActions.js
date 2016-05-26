import React, {PropTypes} from 'react'

export default function AdditionalActions(props) {
  const {
    onChangePrivacy,
    onDeleteClick,
    privacy,
    theme
  } = props

  const {classes} = theme
  return (
    <ul>
      <li>
        <button
          className={classes.additionalActionButton}
          onClick={onChangePrivacy}>
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
  onChangePrivacy: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  privacy: PropTypes.string.isRequired
}
