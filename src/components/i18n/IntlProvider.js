import React from 'react'
import {IntlProvider} from 'react-intl'

import * as translations from '../../i18n'
import conf from '../../conf'

export default ({children}) => (
  <IntlProvider
    locale={conf.user.languageCode}
    messages={translations[conf.user.languageCode]}
  >
    {children}
  </IntlProvider>
)
