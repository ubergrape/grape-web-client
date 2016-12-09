import buttonIcon from '../button/icon'
import {grayLight, blue} from 'grape-theme/dist/base-colors'

const iconOptions = {
  color: grayLight,
  hoverColor: blue,
  iconOnly: true
}

export const padding = 8

export const styles = {
  controls: {
    flexShrink: 0
  },
  attachment: {
    extend: buttonIcon('paperclip', iconOptions),
    padding
  },
  emoji: {
    extend: buttonIcon('smileOpen', iconOptions),
    padding
  },
  search: {
    extend: buttonIcon('hashtag', {...iconOptions, color: blue}),
    padding
  }
}
