import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import * as icons from 'grape-web/lib/svg-icons/data'

import {styles, color} from './linkWithIconTheme'

@injectSheet(styles)
export default class LinkWithIcon extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    target: PropTypes.string
  }

  static defaultProps = {
    icon: 'file'
  }

  getSvg() {
    let {icon} = this.props
    if (icon === 'default' || !icons[icon]) {
      icon = this.constructor.defaultProps.icon
    }
    return getColoredIcon({name: icon, color})
  }

  render() {
    const {url, name, sheet: {classes}, target} = this.props
    const style = {backgroundImage: `url(${this.getSvg()})`}

    return (
      <a href={url} target={target} className={classes.link}>
        <span className={classes.icon} style={style}></span>
        {` ${name}`}
      </a>
    )
  }
}
