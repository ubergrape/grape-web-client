import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import staticUrl from '../../utils/static-url'

const baseUrl = staticUrl('app/sounds')

export default class Sounds extends PureComponent {
  static propTypes = {
    sounds: PropTypes.object,
    loop: PropTypes.bool,
    onEnded: PropTypes.func.isRequired,
    active: PropTypes.string,
  }

  static defaultProps = {
    active: null,
    loop: false,
    sounds: {
      messageIn: `${baseUrl}/message-in.mp3`,
      messageOut: `${baseUrl}/message-out.mp3`,
      mention: `${baseUrl}/mention.mp3`,
      incomingCall: `${baseUrl}/incoming-call.mp3`,
    },
  }

  render() {
    const { sounds, active, loop, onEnded } = this.props

    if (!active) return null

    return (
      <iframe
        src={sounds[active]}
        allow="autoplay"
        title="audio"
        style={{ display: 'none' }}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio autoPlay loop={loop} onEnded={onEnded}>
          <source src={sounds[active]} type="audio/mp3" />
        </audio>
      </iframe>
    )
  }
}
