import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'

export default {
  ...defineMessages({
    oneCall: {
      id: 'oneCallSameTime',
      defaultMessage: 'You can only be in one call at the same time.',
    },
    userInAnotherCall: {
      id: 'userInAnotherCall',
      defaultMessage: '{name} is in another call right now.',
    },
  }),
  joinConference: (
    <FormattedMessage
      id="joinVideoConference"
      defaultMessage="Join video conference"
      description="Sidebar: link to join a video conference"
    />
  ),
  anotherCall: (
    <FormattedMessage
      id="inAnotherCall"
      defaultMessage="You are in another call"
    />
  ),
  inCall: <FormattedMessage id="inCall" defaultMessage="In a call" />,
}
