import {screenWidth} from 'grape-theme/dist/sizes'

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
    flexDirection: 'column'
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
    width: 400
  },
  [`@media (max-width: ${screenWidth.xl}px)`]: {
    aside: {
      width: 230
    },
    sidebar: {
      width: 340
    }
  }
}
