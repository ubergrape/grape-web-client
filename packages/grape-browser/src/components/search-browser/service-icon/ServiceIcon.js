import PropTypes from 'prop-types'
import React, { Component } from 'react'
import icons from 'grape-web/lib/svg-icons/data'
import injectSheet from 'grape-web/lib/jss'

const size = 22

class ServiceIcon extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    service: PropTypes.string,
  }

  static defaultProps = {
    service: 'file',
    theme: {},
  }

  render() {
    const classes = this.props.theme.classes || this.props.sheet.classes
    const { service } = this.props
    const iconUrl = icons[service] || icons.file
    const backgroundImage = `url(${iconUrl})`

    return <span className={classes.icon} style={{ backgroundImage }} />
  }
}

export default injectSheet({
  icon: {
    display: 'inline-block',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: size,
    width: size,
  },
})(ServiceIcon)
