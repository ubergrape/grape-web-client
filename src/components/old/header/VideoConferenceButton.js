import React from 'react'
import PropTypes from 'prop-types'
import { blue, blueLight } from 'grape-theme/dist/base-colors'
import { FormattedMessage, defineMessages } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import isEmpty from 'lodash/isEmpty'

import Tooltip from '../tooltip/HoverTooltip'
import { iconSize } from './constants'
import { userStatusMap } from '../../../constants/app'
import isChromeOrFirefox from '../../../utils/is-chrome-or-firefox'

const tooltips = {
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

const messages = defineMessages({
  oneCall: {
    id: 'oneCallSameTime',
    defaultMessage: 'You can only be in one call at the same time.',
  },
  userInAnotherCall: {
    id: 'userInAnotherCall',
    defaultMessage: '{name} is in another call right now.',
  },
})

export const styles = ({ palette }) => ({
  button: {
    display: 'flex',
    width: iconSize + 16,
    height: iconSize + 16,
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center',
  },
  disabledCamera: {
    color: palette.grey[300],
    width: iconSize,
    height: iconSize,
    cursor: 'pointer',
  },
  cameraActive: {
    color: ({ colors }) => colors.button || blue,
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      cursor: 'pointer',
      // TODO Size here should not be needed.
      // https://github.com/cssinjs/react-jss/issues/165
      width: iconSize,
      height: iconSize,
      color: ({ colors }) => colors.button || blueLight,
    },
  },
  camera: {
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      cursor: 'pointer',
      // TODO Size here should not be needed.
      // https://github.com/cssinjs/react-jss/issues/165
      width: iconSize,
      height: iconSize,
      color: ({ colors }) => colors.button || palette.secondary.A200,
    },
  },
})

const VideoConferenceButton = props => {
  const {
    channel,
    user,
    intl: { formatMessage },
  } = props

  const showVideoConferenceWarning = () => {
    props.showVideoConferenceWarning()
  }

  const showOnAnotherCallToast = () => {
    props.showToastNotification(formatMessage(messages.oneCall))
  }

  const showOnCallToast = () => {
    props.showToastNotification(
      formatMessage(messages.userInAnotherCall, {
        name: channel.partner.displayName,
      }),
    )
  }

  if (isEmpty(channel)) return null

  if (
    channel.type === 'room' &&
    !isEmpty(channel.calls) &&
    userStatusMap[user.status] === 'inCall'
  ) {
    return (
      <Tooltip message={tooltips.inCall}>
        <button
          onClick={showOnAnotherCallToast}
          className={props.classes.button}
        >
          <Icon name="cameraActive" className={props.classes.disabledCamera} />
        </button>
      </Tooltip>
    )
  }

  if (channel.type === 'room' && userStatusMap[user.status] === 'inCall') {
    return (
      <Tooltip message={tooltips.anotherCall}>
        <button onClick={showOnCallToast} className={props.classes.button}>
          <Icon name="camera" className={props.classes.disabledCamera} />
        </button>
      </Tooltip>
    )
  }

  if (userStatusMap[user.status] === 'inCall') {
    return (
      <Tooltip message={tooltips.inCall}>
        <button onClick={showOnCallToast} className={props.classes.button}>
          <Icon name="camera" className={props.classes.disabledCamera} />
        </button>
      </Tooltip>
    )
  }

  if (!isEmpty(channel.calls)) {
    return (
      <Tooltip message={tooltips.joinConference}>
        <a
          href={props.channel.grapecallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={props.classes.button}
        >
          <Icon name="cameraActive" className={props.classes.cameraActive} />
        </a>
      </Tooltip>
    )
  }

  if (isChromeOrFirefox) {
    return (
      <Tooltip message={tooltips.joinConference}>
        <a
          href={props.channel.grapecallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={props.classes.button}
        >
          <Icon name="camera" className={props.classes.camera} />
        </a>
      </Tooltip>
    )
  }

  return (
    <Tooltip message={tooltips.joinConference}>
      <button
        onClick={showVideoConferenceWarning}
        className={props.classes.button}
      >
        <Icon name="camera" className={props.classes.camera} />
      </button>
    </Tooltip>
  )
}

VideoConferenceButton.propTypes = {
  classes: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  showVideoConferenceWarning: PropTypes.func.isRequired,
  showToastNotification: PropTypes.func.isRequired,
}

export default injectSheet(styles)(VideoConferenceButton)
