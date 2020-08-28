import React from 'react'
import theme from 'grape-web/lib/mui-theme'
import ThemeProvider from 'grape-web/lib/components/theme-provider'
import { IntlProvider } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import { renderSheetsInsertionPoints } from '../../app'
import * as translations from '../../i18n'
import conf from '../../conf'
import { baseUrl as fontsBaseUrl } from '../../constants/fonts'

renderSheetsInsertionPoints()

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
  wrapper: {
    fontFamily: "noto-sans, 'Helvetica Neue', Arial, Helvetica, sans-serif",
  },
}

const Wrapper = ({ children, classes }) => (
  <div className={classes.wrapper}>
    <ThemeProvider theme={theme}>
      <IntlProvider
        locale={conf.user.languageCode}
        messages={translations[conf.user.languageCode]}
      >
        {children}
      </IntlProvider>
    </ThemeProvider>
  </div>
)

export default injectSheet(styles)(Wrapper)
