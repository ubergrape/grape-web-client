import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import List from 'react-finite-list'
import {useSheet} from 'grape-web/lib/jss'

import style from './serviceListStyle'
import Service from './Service'
import SectionHeader from '../../section-header/SectionHeader'

@useSheet(style)
export default class ServiceList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    services: PropTypes.array,
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
        onSelect={this.props.onSelect}
        onFocus={this.props.onFocus} />
    )
  }

  render() {
    const {classes} = this.props.sheet
    const {services, focused} = this.props

    return (
      <div>
        <SectionHeader text="services" />
        <List
          className={classes.serviceList}
          renderItem={::this.renderService}
          items={services}
          focused={focused} />
      </div>
    )
  }
}
