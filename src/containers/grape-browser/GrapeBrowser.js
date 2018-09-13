import React from 'react'
import { IntlProvider } from 'react-intl'

import { GrapeBrowser } from '../../components/grape-browser'
import * as translations from '../../i18n'

export default props => (
  <IntlProvider locale={props.locale} messages={translations[props.locale]}>
    {(() => <GrapeBrowser {...props} />)()}
  </IntlProvider>
)
