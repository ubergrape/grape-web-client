import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import style from './serviceStyle'
import ServiceIcon from '../service-icon/ServiceIcon'

@useSheet(style)
export default class Service extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    focused: PropTypes.bool,
    item: PropTypes.object,
    onSelect: PropTypes.func,
    onFocus: PropTypes.func
  }

  static defaultProps = {
    onSelect: noop,
    onFocus: noop
  }

  render() {
    const {classes} = this.props.sheet
    const {item, focused} = this.props

    return (
      <div
        className={`${classes.service} ${focused ? classes.serviceFocused : ''}`}
        onClick={this.props.onSelect.bind(null, item)}
        onMouseOver={this.props.onFocus.bind(null, item)}>
        <div className={classes.iconContainer}>
          <ServiceIcon service={item.id} />
        </div>
        <div className={classes.name}>
          {item.label}
        </div>
        <div className={classes.return}>
          &crarr;
        </div>
      </div>
    )
  }
}
