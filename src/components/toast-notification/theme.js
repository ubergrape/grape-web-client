import {purple, white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import {height} from '../header'

export const verticalSpacing = 13

const barStyles = {
  position: 'fixed',
  top: height + verticalSpacing,
  right: '-100%',
  bottom: 'auto',
  left: 'auto',
  width: 'auto',
  height: verticalSpacing * 2 + normal.fontSize,
  padding: [verticalSpacing, 20],
  margin: 0,
  boxSizing: 'border-box',
  color: white,
  fontSize: normal.fontSize,
  fontFamily: 'inherit',
  lineHeight: 1,
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
    extend: barStyles,
    right: '1rem'
  }
}
