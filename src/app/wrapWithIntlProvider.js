import React, {Component} from 'react'
import {IntlProvider} from 'react-intl'

export default function wrapWithIntlProvider(_Component, locale, messages) {
  return class extends Component {
    render() {
      return (
        <IntlProvider locale={locale} messages={messages}>
          <_Component />
        </IntlProvider>
      )
    }
  }
}
