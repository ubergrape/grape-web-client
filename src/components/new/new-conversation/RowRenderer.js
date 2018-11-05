import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/RowRendererStyles'

const RowRenderer = ({ data, key, style, index, classes }) => {
  const user = data.users[index]
  return (
    <button className={classes.button} key={key} style={style}>
      <img
        className={classes.avatar}
        src={user.avatar}
        alt={user.displayName}
      />
      <div className={classes.text}>
        <span className={classes.name}>{user.displayName}</span>
        <span className={classes.description}>{user.whatIDo}</span>
      </div>
    </button>
  )
}

export default injectSheet(styles)(RowRenderer)
