import {white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import {height} from '../header'
import {zIndex} from '../../utils/z-index'

export const verticalSpacing = 10

const barStyles = {
  position: 'relative',
  right: '-100%',
  top: 'auto',
  bottom: 'auto',
  left: 'auto',
  width: '100%',
  padding: verticalSpacing * 2,
  margin: {
    top: verticalSpacing,
    right: 'auto',
    bottom: 'auto',
    left: verticalSpacing
  },
  boxSizing: 'border-box',
  color: white,
  fontSize: normal.fontSize,
  fontFamily: 'inherit',
  lineHeight: 1,
  textAlign: 'center',
  borderRadius: borderRadius.bigger,
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
  container: {
    position: 'fixed',
    right: verticalSpacing,
    top: height,
    width: 300,
    zIndex: zIndex('base')
  },
  bar: barStyles,
  activeBar: {
    extend: barStyles,
    right: 0,
    marginLeft: 'auto'
  }
}
