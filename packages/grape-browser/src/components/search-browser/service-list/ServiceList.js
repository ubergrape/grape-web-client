import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  defineMessages,
  intlShape,
  FormattedMessage,
  injectIntl,
} from 'react-intl'
import noop from 'lodash/noop'
import List from 'react-finite-list'
import injectSheet from 'grape-web/lib/jss'

import style from './serviceListStyle'
import Service from './Service'
import SectionHeader from '../../section-header/SectionHeader'

const messages = defineMessages({
  services: {
    id: 'serviesHeadline',
    defaultMessage: 'select service',
    description: '**Headline in services list of grape-browser**',
  },
})

class ServiceList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    services: PropTypes.array,
    servicesStats: PropTypes.object,
    onSelect: PropTypes.func,
    onFocus: PropTypes.func,
    focused: PropTypes.object,
  }

  static defaultProps = {
    servicesStats: {},
    services: [],
    onSelect: noop,
    onFocus: noop,
    focused: null,
  }

  renderService = ({ focused, item }) => (
    <Service
      item={item}
      focused={focused}
      resultsAmount={this.props.servicesStats[item.id]}
      onSelect={this.props.onSelect}
      onFocus={this.props.onFocus}
      key={item.id}
    />
  )

  renderBody() {
    const {
      services,
      focused,
      classes,
      intl: { formatMessage },
    } = this.props

    if (!services.length) {
      return (
        <p className={classes.empty}>
          <FormattedMessage
            id="noServicesFound"
            defaultMessage="No services found."
          />
        </p>
      )
    }

    return [
      <SectionHeader text={formatMessage(messages.services)} key="header" />,
      <List
        className={classes.services}
        renderItem={this.renderService}
        items={services}
        focused={focused}
        key="list"
      />,
    ]
  }

  render() {
    const { classes } = this.props

    return <div className={classes.serviceList}>{this.renderBody()}</div>
  }
}

export default injectSheet(style)(injectIntl(ServiceList))
