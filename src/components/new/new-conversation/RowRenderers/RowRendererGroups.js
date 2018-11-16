import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './../styles/RowRendererStyles'

const RowRendererGroups = ({ data, key, style, index, classes }) => {
  if (data.groups[index].text)
    return (
      <div className={classes.wrapper} key={key} style={style}>
        <span className={classes.header}>{data.groups[index].text}</span>
      </div>
    )

  const group = data.groups[index]
  return (
    <button className={classes.button} key={key} style={style}>
      {group.name}
    </button>
  )
}

export default injectSheet(styles)(RowRendererGroups)
