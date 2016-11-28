import {white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import {height} from '../header'

export const verticalSpacing = 10

const barStyles = {
  position: 'fixed',
  top: height + verticalSpacing,
  right: '-100%',
  bottom: 'auto',
  left: 'auto',
  width: 'auto',
  minWidth: 250,
  height: verticalSpacing*4 + normal.fontSize,
  padding: verticalSpacing*2,
  margin: 0,
  boxSizing: 'border-box',
  color: white,
  fontSize: normal.fontSize,
  fontFamily: 'inherit',
  lineHeight: 1,
  textAlign: 'center',
  borderRadius: borderRadius.big,
  border: {
    width: 1,
    style: 'solid',
    color: '#ebeef3'
  },
  background: '#6257d2',
  boxShadow: 'none',
  transition: '0.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
  transform: 'translatez(0)'
}

export const styles = {
  bar: barStyles,
  activeBar: {
    extend: barStyles,
    right: verticalSpacing
  }
}
