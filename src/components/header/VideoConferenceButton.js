import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import Tooltip from '../tooltip/HoverTooltip'
import { iconSize } from './constants'

const tooltipText = (
  <FormattedMessage
    id="joinVideoConference"
    defaultMessage="Join video conference"
    description="Sidebar: link to join a video conference"
  />
)

export const styles = ({ palette }) => ({
  button: {
    display: 'flex',
    width: iconSize + 16,
    height: iconSize + 16,
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center',
  },
  camera: {
    color: palette.text.primary,
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

const isSupportedBrowser =
  (navigator.userAgent.includes('Firefox') ||
    navigator.userAgent.includes('Chrome')) &&
  !navigator.userAgent.includes('Edge')

const VideoConferenceButton = props => {
  const showVideoConferenceWarning = () => {
    props.showVideoConferenceWarning()
  }

  return isSupportedBrowser ? (
    <Tooltip message={tooltipText}>
      <a
        href={props.channel.videoconferenceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={props.classes.button}
      >
        <Icon name="camera" className={props.classes.camera} />
      </a>
    </Tooltip>
  ) : (
    <Tooltip message={tooltipText}>
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
  showVideoConferenceWarning: PropTypes.func.isRequired,
}

export default injectSheet(styles)(VideoConferenceButton)
