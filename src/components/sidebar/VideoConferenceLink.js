import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import { small } from 'grape-theme/dist/fonts'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const isSupportedBrowser =
  navigator.userAgent.includes('Firefox') ||
  navigator.userAgent.includes('Chrome')

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
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textAlign: 'left',
    marginBottom: sizes.spacer.s,
    color: '#707782',
    paddingLeft: '1rem',
    '&:hover': {
      isolate: false,
      color: palette.text.primary,
    },
    '&:hover:before': {
      isolate: false,
      content: '""',
      width: 18,
      height: 18,
      marginRight: 5,
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'camera',
          color: `${colors.button || palette.secondary.A200}`,
        })}')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
      backgroundSize: 'contain',
    },
  },
})

class VideoConferenceLink extends Component {
  onClick = () => {
    this.props.showVideoConferenceWarning()
  }

  render() {
    const { classes, channel } = this.props
    return (
      <div>
        {isSupportedBrowser ? (
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
        ) : (
          <button onClick={this.onClick} className={classes.root}>
            <FormattedMessage
              id="joinVideoConference"
              defaultMessage="Join video conference"
              description="Sidebar: link to join a video conference"
            />
          </button>
        )}
      </div>
    )
  }
}

export default injectSheet(styles)(VideoConferenceLink)
