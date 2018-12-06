import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRendererUsers = props => (
  <span className={props.classes.text}>
    Nice name, but unfortunately nobody in your organization could be found.
  </span>
)

export default injectSheet(styles)(NoRowsRendererUsers)
