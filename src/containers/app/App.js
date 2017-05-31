import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {IntlProvider} from 'react-intl'

import * as translations from '../../i18n'

export default class App extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired
  }

  static defaultProps = {
    locale: 'en'
  }

  render() {
    const {locale, children} = this.props

    return (
      <IntlProvider locale={locale} messages={translations[locale]}>
        {children}
      </IntlProvider>
    )
  }
}
