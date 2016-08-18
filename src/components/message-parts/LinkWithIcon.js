import React, {PropTypes, Component} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import * as icons from 'grape-web/lib/svg-icons/data'
import shallowCompare from 'react-addons-shallow-compare'

import {styles, color} from './linkWithIconTheme'

@useSheet(styles)
export default class LinkWithIcon extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {url, name, sheet, icon, target} = this.props
    const {classes} = sheet
    const svg = getColoredIcon({
      name: icons[icon] ? icon : this.constructor.defaultProps.icon,
      color
    })
    const style = {backgroundImage: `url(${svg})`}

    return (
      <a href={url} target={target} className={classes.link}>
        <span className={classes.icon} style={style}></span>
        {` ${name}`}
      </a>
    )
  }
}
