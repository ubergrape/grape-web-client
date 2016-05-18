import {grayLight, gray} from 'grape-theme/dist/base-colors'
import {link} from 'grape-theme/dist/web-colors'

import buttonIcon from '../button/icon'

function createGlobeIcon(options) {
  const globe = buttonIcon('globe', {
    iconOnly: true,
    ...options
  })

  globe['&:before'] = {
    ...globe['&:before'],
    verticalAlign: 'middle',
    marginLeft: 3,
    marginBottom: 3
  }

  return globe
}

const globe = createGlobeIcon({color: grayLight, hoverColor: link})
const globeActive = createGlobeIcon({color: link})

export default {
  time: {
    display: 'inline-block',
    color: grayLight,
    flexShrink: 0
  },
  timeContainer: {
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  timeContainerHoverable: {
    extend: 'timeContainer',
    cursor: 'pointer',
    '&:hover': {
      color: link
    }
  },
  userTime: {
    display: 'inline-block'
  },
  userTimeContainer: {
    padding: 10,
    whiteSpace: 'nowrap'
  },
  userTimeText: {
  },
  userTimeTime: {
    color: gray
  },
  globe,
  globeActive,
  tooltip: {
    marginTop: -5
  }
}
