import React, {PureComponent} from 'react'
import colors from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'
import Normalize from 'grape-web/lib/components/normalize'

import {baseUrl as fontsBaseUrl} from '../../constants/fonts'
import conf from '../../conf'

const getFontFace = ({family, style = 'normal', weight = 400, formats = ['woff2', 'woff', 'ttf']}) => ({
  fontFamily: `"${family}"`,
  fontStyle: style,
  fontWeight: weight,
  src: formats.map(format => (
    `url(${fontsBaseUrl}/${family}-${style}.${format}) format("${format}")`
  ))
})

@injectSheet({
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
  appContainer: {
    position: 'relative',
    height: '100%',
    border: [conf.embed ? 1 : 0, 'solid', colors.grayBlueLighter]
  }
})
export default class AppContainer extends PureComponent {
  render() {
    const {classes, children} = this.props
    return <Normalize className={classes.appContainer}>{children}</Normalize>
  }
}
