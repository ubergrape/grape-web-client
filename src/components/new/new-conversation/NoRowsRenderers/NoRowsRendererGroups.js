import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRendererGroups = props => (
  <span className={props.classes.text}>
    Nice group name, but unfortunately nobody else created a group named like
    this.
  </span>
)

export default injectSheet(styles)(NoRowsRendererGroups)
