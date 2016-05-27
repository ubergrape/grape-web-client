import {white, blue, grayBlueDark} from 'grape-theme/dist/base-colors'

const toggler = {
  position: 'absolute',
  top: 2,
  bottom: 2,
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
    lineHeight: '32px',
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
      left: 'calc(50% - 2px)',
      right: 2
    }
  },
  switchOff: {
    background: grayBlueDark,
    '&:after': {
      ...toggler,
      left: 2,
      right: 'calc(50% - 2px)'
    }
  },
  label: {
    whiteSpace: 'nowrap',
    padding: '0 10px'
  }
}
