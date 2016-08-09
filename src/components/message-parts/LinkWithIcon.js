import React, {PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import {styles, color} from './linkWithIconTheme'

function LinkWithIcon(props) {
  const {url, name, sheet, icon, target} = props
  const {classes} = sheet
  const svg = getColoredIcon({name: icon, color})
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
  target: '_blank',
  icon: 'file'
}

export default useSheet(LinkWithIcon, styles)
