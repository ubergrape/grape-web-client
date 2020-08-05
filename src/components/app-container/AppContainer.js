import React, { PureComponent } from 'react'
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

@injectSheet({
  '@font-face': [
    getFontFace({ family: 'noto-sans' }),
    getFontFace({
      family: 'noto-sans',
      style: 'bold',
      weight: 700,
    }),
    getFontFace({
      family: 'noto-sans',
      style: 'italic',
    }),
  ],
  appContainer: {
    display: 'block',
    position: 'relative',
    height: '100%',
  },
})
export default class AppContainer extends PureComponent {
  render() {
    const { classes, children } = this.props
    return <Normalize className={classes.appContainer}>{children}</Normalize>
  }
}
