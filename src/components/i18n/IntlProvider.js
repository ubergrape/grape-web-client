import React from 'react'
import {IntlProvider} from 'react-intl'

import * as translations from '../../i18n'
import conf from '../../conf'

const {user} = conf

export default ({children}) => (
  <IntlProvider
    locale={user.languageCode}
    messages={translations[user.languageCode]}
  >
    {children}
  </IntlProvider>
)
