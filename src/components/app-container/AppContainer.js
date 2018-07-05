import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import Normalize from 'grape-web/lib/components/normalize'

import { baseUrl as fontsBaseUrl } from '../../constants/fonts'

const getFontFace = ({
  family,
  style = 'normal',
  weight = 400,
  formats = ['woff2', 'woff', 'ttf'],
}) => ({
  fontFamily: `"${family}"`,
  fontStyle: style,
  fontWeight: weight,
  src: formats.map(
    format =>
      `url(${fontsBaseUrl}/${family}-${style}.${format}) format("${format}")`,
  ),
})

const styles = {
  '@font-face': [
    getFontFace({ family: 'proxima-nova' }),
    getFontFace({
      family: 'proxima-nova',
      style: 'bold',
      weight: 700,
    }),
    getFontFace({
      family: 'proxima-nova',
      style: 'italic',
    }),
  ],
  appContainer: {
    display: 'block',
    position: 'relative',
    height: '100%',
  },
}

const AppContainer = ({ classes, children }) => (
  <Normalize className={classes.appContainer}>{children}</Normalize>
)

export default injectSheet(styles)(AppContainer)
