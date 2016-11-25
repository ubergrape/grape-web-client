import React, {PureComponent, PropTypes} from 'react'
import staticUrl from 'staticurl'

const baseUrl = staticUrl('app/sounds')

export default class Sounds extends PureComponent {
  static propTypes = {
    sounds: PropTypes.object.isRequired,
    onEnded: PropTypes.func.isRequired,
    active: PropTypes.string
  }

  static defaultProps = {
    sounds: {
      messageIn: `${baseUrl}/message-in.wav`,
      messageOut: `${baseUrl}/message-out.mp3`,
      mention: `${baseUrl}/mention.wav`
    }
  }

  render() {
    const {sounds, active, onEnded} = this.props
    if (!active) return null

    return (
      <audio
        src={sounds[active]}
        autoPlay
        onEnded={onEnded} />
    )
  }
}
