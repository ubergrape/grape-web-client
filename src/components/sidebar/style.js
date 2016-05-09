import {screenWidth} from 'grape-theme/dist/sizes'

export default {
  sidebar: {
    position: 'fixed',
    top: 57,
    right: 0,
    bottom: 0,
    zIndex: 50,
    width: 400
  },
  [`@media (max-width: ${screenWidth.xl}px)`]: {
    sidebar: {
      width: 340
    }
  }
}
