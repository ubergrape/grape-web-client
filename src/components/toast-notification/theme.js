import {purple, white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import {height} from '../header'

const barStyles = {
  position: 'fixed',
  top: height + 10,
  right: '-100%',
  bottom: 'auto',
  left: 'auto',
  width: 'auto',
  height: 13 * 2 + normal.fontSize,
  padding: [13, 20],
  margin: 0,
  boxSizing: 'border-box',
  color: white,
  fontSize: normal.fontSize,
  fontFamily: 'inherit',
  lineHeight: normal.fontSize,
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
  transform: 'translatez(0)',

}

export const styles = {
  bar: barStyles,
  activeBar: {
    extend: barStyles,
    right: '1rem'
  }
}
