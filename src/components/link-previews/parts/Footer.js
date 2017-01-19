import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {injectIntl, intlShape} from 'react-intl'

import {styles} from './footerTheme.js'

@injectSheet(styles)
@injectIntl
export default class Footer extends PureComponent {
  static propTypes = {
    serviceIcon: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
    serviceUrl: PropTypes.string.isRequired,
    link: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  }

  renderIcon(serviceIcon) {
    const {sheet: {classes}} = this.props
    return <img className={classes.icon} src={serviceIcon} alt="" />
  }

  renderInfo() {
    const {
      serviceIcon,
      serviceName,
      timestamp,
      intl: {formatDate, formatTime},
      sheet: {classes}
    } = this.props

    const when = `${formatDate(timestamp, {
      year: '2-digit',
      month: 'short',
      day: '2-digit'
    })} ${formatTime(timestamp)}`

    return (
      <div className={classes.container}>
        {serviceIcon && this.renderIcon(serviceIcon)}
        <span className={classes.text}>{serviceName} | {when}</span>
      </div>
    )
  }

  render() {
    const {
      serviceUrl,
      sheet: {classes}
    } = this.props

    if (!serviceUrl) {
      return this.renderInfo()
    }

    return (
      <a
        className={classes.link}
        href={serviceUrl}
        target="_blank"
        rel="noreferrer">
        {this.renderInfo()}
      </a>
    )
  }
}
