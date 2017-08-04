import {grayLight, blue} from 'grape-theme/dist/base-colors'
import {bigger} from 'grape-theme/dist/fonts'

import buttonIcon from '../button/icon'

const iconOptions = {
  color: grayLight,
  hoverColor: blue,
  iconOnly: true
}

export const padding = 8

export const styles = {
  controls: {
    extend: bigger,
    flexShrink: 0
  },
  attachment: {
    extend: buttonIcon('paperclip', iconOptions),
    padding,
    fontSize: 'inherit'
  },
  emoji: {
    extend: buttonIcon('smileOpen', iconOptions),
    padding,
    fontSize: 'inherit'
  },
  search: {
    extend: buttonIcon('hashtag', {...iconOptions, color: blue}),
    padding,
    fontSize: 'inherit'
  }
}
