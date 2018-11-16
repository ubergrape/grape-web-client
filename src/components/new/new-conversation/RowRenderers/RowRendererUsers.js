import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import Status from '../../status/Status'
import styles from './../styles/RowRendererStyles'

const RowRendererUsers = ({ data, key, style, index, classes }) => {
  if (data.users[index].text)
    return (
      <div className={classes.wrapper} key={key} style={style}>
        <span className={classes.header}>{data.users[index].text}</span>
      </div>
    )

  const user = data.users[index]
  return (
    <button className={classes.button} key={key} style={style}>
      <div className={classes.avatar}>
        <img
          className={classes.image}
          src={user.avatar}
          alt={user.displayName}
        />
        <Status status={user.status} />
      </div>
      <div className={classes.text}>
        <span className={classes.name}>{user.displayName}</span>
        <span className={classes.description}>{user.whatIDo}</span>
      </div>
    </button>
  )
}

export default injectSheet(styles)(RowRendererUsers)
