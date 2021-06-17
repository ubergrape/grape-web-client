import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { injectIntl, intlShape } from 'react-intl'

import { styles } from './footerTheme.js'

@injectSheet(styles)
@injectIntl
export default class Footer extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.number,
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    icon: null,
    timestamp: null,
  }

  renderIcon(icon) {
    const {
      sheet: { classes },
    } = this.props
    return <img className={classes.icon} src={icon} alt="" />
  }

  render() {
    const {
      icon,
      text,
      timestamp,
      intl: { formatDate, formatTime },
      sheet: { classes },
    } = this.props

    const when =
      timestamp &&
      `${formatDate(timestamp, {
        year: '2-digit',
        month: 'short',
        day: '2-digit',
      })} ${formatTime(timestamp)}`

    const content = [text, when].filter(Boolean).join(' | ')

    return (
      <span className={classes.container}>
        {icon && this.renderIcon(icon)}
        <span className={classes.text}>{content}</span>
      </span>
    )
  }
}
