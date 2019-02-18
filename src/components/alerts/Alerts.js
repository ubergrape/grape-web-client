import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'
import fonts from 'grape-theme/dist/fonts'

import { zIndex } from '../../utils/z-index'
import Alert from './Alert'

@injectSheet({
  alerts: {
    extend: fonts.small,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: zIndex('alerts'),
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
})
export default class Alerts extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    alerts: PropTypes.array,
    reconnect: PropTypes.object.isRequired,
    enableNotifications: PropTypes.func,
    onReconnect: PropTypes.func,
    hideAlert: PropTypes.func,
  }

  static defaultProps = {
    hideAlert: noop,
    enableNotifications: noop,
    onReconnect: noop,
    alerts: [],
  }

  render() {
    const { alerts, classes, hideAlert, ...rest } = this.props

    if (!alerts.length) return null

    return (
      <div className={classes.alerts}>
        {alerts.map(alert => (
          <Alert {...rest} alert={alert} key={alert.type} onHide={hideAlert} />
        ))}
      </div>
    )
  }
}
