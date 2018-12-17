import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import { small } from 'grape-theme/dist/fonts'
import { isElectron } from 'grape-web/lib/x-platform/electron'
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

class VideoConferenceLink extends React.Component {
  onClick = () => {
    window
      .require('electron')
      .shell.openExternal(this.props.channel.videoconferenceUrl)
  }

  render() {
    const { channel, classes } = this.props

    if (isElectron) {
      return (
        <button className={classes.root} onClick={this.onClick}>
          Join Video Chat
        </button>
      )
    }

    return (
      <a
        href={channel.videoconferenceUrl}
        className={classes.root}
        target="_blank"
        rel="noopener noreferrer"
      >
        Join Video Chat
      </a>
    )
  }
}

export default injectSheet(styles)(VideoConferenceLink)
