import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {injectIntl, intlShape} from 'react-intl'

import {styles} from './footerTheme.js'

@injectSheet(styles)
@injectIntl
export default class Footer extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    url: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  }

  renderIcon(icon) {
    const {sheet: {classes}} = this.props
    return <img className={classes.icon} src={icon} alt="" />
  }

  renderInfo() {
    const {
      icon,
      text,
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
        {icon && this.renderIcon(icon)}
        <span className={classes.text}>{text} | {when}</span>
      </div>
    )
  }

  render() {
    const {
      url,
      sheet: {classes}
    } = this.props

    if (!url) return this.renderInfo()

    return (
      <a
        className={classes.link}
        href={url}
        target="_blank"
        rel="noreferrer">
        {this.renderInfo()}
      </a>
    )
  }
}
