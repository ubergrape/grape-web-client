import {screenWidth} from 'grape-theme/dist/sizes'

export const sidebarWidthXl = 400
export const sidebarWidth = 340

export const styles = {
  app: {
    display: 'flex',
    height: '100vh'
  },
  aside: {
    display: 'flex',
    position: 'relative',
    minWidth: 200,
    width: 280,
    flexShrink: 0,
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  mainBody: {
    display: 'flex',
    flex: 1
  },
  mainLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative'
  },
  historyWrapper: {
    position: 'relative',
    flex: 1
  },
  sidebar: {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    flexBasis: 'auto',
    width: sidebarWidthXl
  },
  [`@media (max-width: ${screenWidth.xl}px)`]: {
    aside: {
      width: 230
    },
    sidebar: {
      width: sidebarWidth
    }
  }
}
