import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import staticUrl from '../../utils/static-url'

const baseUrl = staticUrl('app/sounds')

export default class Sounds extends PureComponent {
  static propTypes = {
    sounds: PropTypes.object.isRequired,
    onEnded: PropTypes.func.isRequired,
    active: PropTypes.string
  }

  static defaultProps = {
    active: null
  }

  static defaultProps = {
    sounds: {
      messageIn: `${baseUrl}/message-in.mp3`,
      messageOut: `${baseUrl}/message-out.mp3`,
      mention: `${baseUrl}/mention.mp3`
    }
  }

  render() {
    const {sounds, active, onEnded} = this.props
    if (!active) return null

    return (
      <audio
        src={sounds[active]}
        autoPlay
        onEnded={onEnded}
      />
    )
  }
}
