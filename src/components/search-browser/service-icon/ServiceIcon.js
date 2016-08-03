import React, {Component, PropTypes} from 'react'
import * as icons from 'grape-web/lib/svg-icons/data'
import {useSheet} from 'grape-web/lib/jss'

import * as style from './style'

// Service/icon map for exceptions where service name doesn't match icon name.
// TODO it should be a service implementation detail.
const serviceIconMap = {
  googledrive: icons.googleDrive,
  gcal: icons.googleCalendar
}

@useSheet(style)
export default class ServiceIcon extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    service: PropTypes.string
  }

  static defaultProps = {
    service: 'file',
    theme: {}
  }

  render() {
    const classes = this.props.theme.classes || this.props.sheet.classes
    const {service} = this.props
    const iconUrl = icons[service] || serviceIconMap[service] || icons.file
    const backgroundImage = `url(${iconUrl})`

    return (
      <span
        className={classes.icon}
        style={{backgroundImage}} />
    )
  }
}
