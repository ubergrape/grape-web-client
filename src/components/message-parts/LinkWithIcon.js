import React, {PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import * as icons from 'grape-web/lib/svg-icons/data'

import {styles} from './linkWithIconTheme'

function LinkWithIcon(props) {
  const {url, name, sheet, icon, target} = props
  const {classes} = sheet
  const svg = icons[icon] || icons.file
  const style = {backgroundImage: `url(${svg})`}

  return (
    <a href={url} target={target} className={classes.link}>
      <span className={classes.icon} style={style}></span>
      {` ${name}`}
    </a>
  )
}

LinkWithIcon.propTypes = {
  sheet: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  target: PropTypes.string
}

LinkWithIcon.defaultProps = {
  target: '_blank'
}

export default useSheet(LinkWithIcon, styles)
