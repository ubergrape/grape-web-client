import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {
  defineMessages,
  intlShape,
  FormattedMessage,
  injectIntl
} from 'react-intl'
import noop from 'lodash/utility/noop'
import List from 'react-finite-list'
import injectSheet from 'grape-web/lib/jss'

import style from './serviceListStyle'
import Service from './Service'
import SectionHeader from '../../section-header/SectionHeader'

const messages = defineMessages({
  services: {
    id: 'serviesHeadline',
    defaultMessage: 'services',
    description: '**Headline in services list of grape-browser**'
  }
})

@injectSheet(style)
@injectIntl
export default class ServiceList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    services: PropTypes.array,
    servicesResultsAmounts: PropTypes.object,
    onSelect: PropTypes.func,
    onFocus: PropTypes.func,
    focused: PropTypes.object
  }

  static defaultProps = {
    services: [],
    onSelect: noop,
    onFocus: noop
  }

  renderService(props) {
    return (
      <Service
        {...props}
        resultsAmount={this.props.servicesResultsAmounts[props.item.id]}
        onSelect={this.props.onSelect}
        onFocus={this.props.onFocus} />
    )
  }

  renderBody() {
    const {
      services, focused,
      sheet: {classes},
      intl: {formatMessage}
    } = this.props

    if (!services.length) {
      return (
        <p className={classes.empty}>
          <FormattedMessage
            id="noServicesFound"
            defaultMessage="No services found." />
        </p>
      )
    }

    return [
      <SectionHeader text={formatMessage(messages.services)} key="header" />,
      <List
        className={classes.services}
        renderItem={::this.renderService}
        items={services}
        focused={focused}
        key="list" />
    ]
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.serviceList}>
        {this.renderBody()}
      </div>
    )
  }
}
