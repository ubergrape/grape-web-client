import {white} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius, screenWidth} from 'grape-theme/dist/sizes'
import {translateZ, translateX} from 'css-functions'
import {height} from '../header'
import {zIndex} from '../../utils/z-index'
import {sidebarWidth, sidebarWidthXl} from '../app-layout'

const spacing = 10

const width = 275

export const transitionDuration = 500

export const styles = {
  container: {
    position: 'fixed',
    right: 0,
    top: height,
    width,
    zIndex: zIndex('base')
  },
  // We don't want notification to cover sidebar.
  hasSidebar: {
    right: sidebarWidthXl,
    [`@media (max-width: ${screenWidth.xl}px)`]: {
      right: sidebarWidth
    }
  },
  bar: {
    position: 'relative',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 0,
    width: '100%',
    padding: spacing * 2,
    margin: {
      top: spacing,
      left: spacing
    },
    boxSizing: 'border-box',
    boxShadow: 'none',
    color: white,
    fontSize: normal.fontSize,
    fontFamily: 'inherit',
    lineHeight: 1,
    textAlign: 'center',
    border: {
      width: 1,
      style: 'solid',
      // FIXME use grape-theme
      color: '#ebeef3'
    },
    borderRadius: borderRadius.bigger,
    // FIXME use grape-theme
    background: '#6257d2',
    transition: `transform ${transitionDuration}ms cubic-bezier(0.89, 0.01, 0.5, 1.1)`,
    transform: [translateZ(0), translateX(width)]
  },
  activeBar: {
    transform: translateX(-spacing * 2),
    marginLeft: 'auto'
  }
}
