import {screenWidth} from 'grape-theme/dist/sizes'
import {baseUrl as fontsBaseUrl} from '../../constants/fonts'

export const sidebarWidthXl = 400
export const sidebarWidth = 340

const getFontFace = ({family, style = 'normal', weight = 400, formats = ['woff2', 'woff', 'ttf']}) => ({
  fontFamily: `"${family}"`,
  fontStyle: style,
  fontWeight: weight,
  src: formats.map(format => (
    `url(${fontsBaseUrl}/${family}-${style}.${format}) format("${format}")`
  ))
})

export const styles = {
  '@font-face': [
    getFontFace({family: 'proxima-nova'}),
    getFontFace({
      family: 'proxima-nova',
      style: 'bold',
      weight: 700
    }),
    getFontFace({
      family: 'proxima-nova',
      style: 'italic'
    })
  ],
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
    flex: 1,
    // Flexbox fix, otherwise it stretches full height and you can't scroll
    // anywhere inside in Firefox at least.
    maxHeight: '100%'
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
