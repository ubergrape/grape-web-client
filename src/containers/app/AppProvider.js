import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'

import * as translations from '../../i18n'

export default class AppProvider extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    locale: 'en',
    children: null,
  }

  render() {
    const { locale, children } = this.props

    return (
      <IntlProvider locale={locale} messages={translations[locale]}>
        {children}
      </IntlProvider>
    )
  }
}
