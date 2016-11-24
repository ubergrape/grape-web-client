import {purple, white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'

const barStyles = {
  extend: [normal],
  position: 'fixed',
  top: '1rem',
  right: '-100%',
  bottom: 'auto',
  left: 'auto',
  width: 'auto',
  padding: '1.5rem 1rem',
  margin: 0,
  color: white,
  fontFamily: 'inherit',
  borderRadius: borderRadius.big,
  background: purple,
  boxShadow: {
    x: 0,
    y: 0,
    blur: 1,
    spread: 1,
    color: 'rgba(10, 10, 11, .125)'
  },
  transition: '0.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
  transform: 'translatez(0)'
}

export const styles = {
  bar: barStyles,
  activeBar: {
    extend: [barStyles],
    right: '1rem'
  }
}
