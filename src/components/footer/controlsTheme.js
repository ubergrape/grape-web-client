import buttonIcon from '../button/icon'
import {grayLight, blue} from 'grape-theme/dist/base-colors'

const iconOptions = {
  color: grayLight,
  hoverColor: blue,
  iconOnly: true
}

export const styles = {
  controls: {
    flexShrink: 0
  },
  attachment: {
    composes: '$button',
    extend: buttonIcon('paperclip', iconOptions)
  },
  emoji: {
    composes: '$button',
    extend: buttonIcon('smileOpen', iconOptions)
  },
  search: {
    composes: '$button',
    extend: buttonIcon('hashtag', {...iconOptions, color: blue})
  },
  button: {
    padding: 8
  }
}
