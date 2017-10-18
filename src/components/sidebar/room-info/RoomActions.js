import React from 'react'
import {FormattedMessage} from 'react-intl'

export default ({onLeave, onInvite, onAddIntegration, channel, classes}) => (
  <article className={classes.actions}>
    <ul>
      <li className={classes.actionItem}>
        <button
          onClick={onInvite}
          className={classes.buttonInvite}
        >
          <FormattedMessage
            id="inviteMoreToGroup"
            defaultMessage="Invite more people to this group"
            description="Room Info Panel: link to invite people to the group/room"
          />
        </button>
      </li>
      <li className={classes.actionItem}>
        <button
          onClick={onAddIntegration}
          className={classes.buttonIntegration}
        >
          <FormattedMessage
            id="addServiceIntegration"
            defaultMessage="Add service integration"
            description="Room Info Panel: link to add an integration to the current room"
          />
        </button>
      </li>
      <li className={classes.actionItem}>
        <button
          onClick={onLeave}
          className={classes.buttonLeave}
        >
          <FormattedMessage
            id="leaveChannel"
            defaultMessage="Leave {channel}"
            values={{channel: channel.name}}
            description="Room Info Panel: leave room link"
          />
        </button>
      </li>
    </ul>
  </article>
)
