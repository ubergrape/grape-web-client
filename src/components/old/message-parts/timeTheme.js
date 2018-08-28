import { grayLight, gray } from 'grape-theme/dist/base-colors'
import { link } from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'

import buttonIcon from '../button/icon'

function createGlobeIcon(options) {
  const globe = buttonIcon('globe', {
    iconOnly: true,
    ...options,
  })

  globe['&:before'] = {
    ...globe['&:before'],
    verticalAlign: 'middle',
    marginLeft: 3,
    marginBottom: 3,
  }

  return globe
}

const globe = createGlobeIcon({ color: grayLight, hoverColor: link })
const globeActive = createGlobeIcon({ color: link })

export const styles = {
  time: {
    display: 'inline-block',
    flexShrink: 0,
  },
  timeContainer: {
    extend: fonts.small,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color: grayLight,
  },
  timeContainerHoverable: {
    composes: '$timeContainer',
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      color: link,
    },
  },
  userTime: {
    display: 'inline-block',
  },
  userTimeContainer: {
    padding: 10,
    whiteSpace: 'nowrap',
  },
  userTimeText: {
    extend: fonts.small,
    color: grayLight,
  },
  userTimeTime: {
    composes: '$userTimeText',
    color: gray,
  },
  globe,
  globeActive,
  tooltip: {
    marginTop: 15,
    marginLeft: -17,
  },
}
