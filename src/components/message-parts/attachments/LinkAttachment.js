import React, {PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import * as icons from 'grape-web/lib/svg-icons/data'

import styles from './linkAttachmentStyles'

function LinkAttachment(props) {
  const {url, name, sheet, category} = props
  const svg = icons[category] || icons.file
  const style = {backgroundImage: `url(${svg})`}

  return (
    <a href={url} target="_blank">
      <span className={sheet.classes.icon} style={style}></span>
      {name}
    </a>
  )
}

LinkAttachment.propTypes = {
  sheet: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired
}

export default useSheet(LinkAttachment, styles)
