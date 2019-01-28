import React from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import { small } from 'grape-theme/dist/fonts'
import { isElectron } from 'grape-web/lib/x-platform/electron'
import { Link as RouterLink } from 'grape-web/lib/router'
import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const styles = ({ palette }) => ({
  root: {
    extend: [
      linkButton,
      small,
      buttonIcon('camera', {
        color: palette.text.primary,
        hoverColor: palette.secondary.A200,
        size: 18,
      }),
    ],
    width: '100%',
    textAlign: 'left',
    marginBottom: sizes.spacer.s,
    color: '#707782',
    paddingLeft: '1rem',
    '&:hover': {
      isolate: false,
      color: palette.text.primary,
    },
  },
})

// In Electron calls should be opened in a second window.
// In a Browser it should be opened as a new tab.
function VideoConferenceLink(props) {
  const { channel, classes } = props

  if (isElectron) {
    return (
      <RouterLink to={channel.videoconferenceUrl} className={classes.root}>
        <FormattedMessage
          id="joinVideoConference"
          defaultMessage="Join video conference"
          description="Sidebar: link to join a video conference"
        />
      </RouterLink>
    )
  }

  return (
    <a
      href={channel.videoconferenceUrl}
      className={classes.root}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FormattedMessage
        id="joinVideoConference"
        defaultMessage="Join video conference"
        description="Sidebar: link to join a video conference"
      />
    </a>
  )
}

export default injectSheet(styles)(VideoConferenceLink)
