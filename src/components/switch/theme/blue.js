import { small } from 'grape-theme/dist/fonts'
import { white, blue, grayBlueDark } from 'grape-theme/dist/base-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'

const togglerMargin = 2

const transitionTimingFunction = 'ease-out'

const toggler = {
  position: 'absolute',
  top: togglerMargin,
  bottom: togglerMargin,
  width: '50%',
  background: white,
  borderRadius: 4,
  transition: 'left 0.2s, right 0.2s',
  transitionTimingFunction,
  willChange: 'left, right',
  content: '""',
  cursor: 'pointer',
}

export const styles = {
  switch: {
    display: 'inline-flex',
    position: 'relative',
    borderRadius: 5,
    color: white,
    cursor: 'pointer',
    transition: 'background 0.2s',
    transitionTimingFunction,
    willChange: 'background',
  },
  switchOn: {
    background: ({ colors }) => colors.button || blue,
    '&:after': {
      ...toggler,
      left: `calc(50% - ${togglerMargin}px)`,
      right: togglerMargin,
    },
  },
  switchOff: {
    background: grayBlueDark,
    '&:after': {
      ...toggler,
      left: togglerMargin,
      right: `calc(50% - ${togglerMargin}px)`,
    },
  },
  switchDisabled: {
    opacity: 0.2,
    pointerEvents: 'none',
  },
  label: {
    extend: [small, ellipsis],
    lineHeight: 2.5,
    whiteSpace: 'nowrap',
    padding: [0, 7],
    width: '100%',
    color: 'inherit',
    cursor: 'pointer',
  },
  rightLabel: {
    textAlign: 'right',
  },
}
