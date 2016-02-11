import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import List from 'react-finite-list'
import {useSheet} from 'grape-web/lib/jss'

import style from './serviceListStyle'
import Service from './Service'

@useSheet(style)
export default class ServiceList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    services: PropTypes.array,
    onSelect: PropTypes.func,
    focusedAction: PropTypes.object
  }

  static defaultProps = {
    onSelect: noop
  }

  renderService(props) {
    return (
      <Service
        {...props}
        onSelect={this.props.onSelect} />
    )
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <List
        className={classes.serviceList}
        renderItem={::this.renderService}
        items={this.props.services}
        focused={this.props.focusedAction} />
    )
  }
}
