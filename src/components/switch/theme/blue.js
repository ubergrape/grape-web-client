import {small} from 'grape-theme/dist/fonts'
import {white, blue, grayBlueDark} from 'grape-theme/dist/base-colors'

const togglerMargin = 2

const toggler = {
  position: 'absolute',
  top: togglerMargin,
  bottom: togglerMargin,
  width: '50%',
  background: white,
  borderRadius: 4,
  transition: 'left 0.3s ease-in, right 0.3s ease-in',
  willChange: 'left, top',
  content: '""'
}

export const styles = {
  switch: {
    display: 'inline-flex',
    position: 'relative',
    borderRadius: 5,
    color: white,
    cursor: 'pointer',
    transition: 'background 0.3s ease-in',
    willChange: 'background'
  },
  switchOn: {
    background: blue,
    '&:after': {
      ...toggler,
      left: `calc(50% - ${togglerMargin}px)`,
      right: togglerMargin
    }
  },
  switchOff: {
    background: grayBlueDark,
    '&:after': {
      ...toggler,
      left: togglerMargin,
      right: `calc(50% - ${togglerMargin}px)`
    }
  },
  switchDisabled: {
    opacity: 0.2,
    pointerEvents: 'none'
  },
  label: {
    extend: small,
    lineHeight: 2.5,
    whiteSpace: 'nowrap',
    padding: '0 10px'
  }
}
