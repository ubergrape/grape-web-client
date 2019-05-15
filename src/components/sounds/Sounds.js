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
      incomingCall: `http://localhost:8081/src/sounds/incoming-call.mp3`,
    },
  }

  render() {
    const { sounds, active, loop, onEnded } = this.props
    if (!active) return null

    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <audio src={sounds[active]} loop={loop} autoPlay onEnded={onEnded} />
  }
}
