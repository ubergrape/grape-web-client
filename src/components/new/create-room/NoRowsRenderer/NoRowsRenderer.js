import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRenderer = ({ classes, filter }) => (
  <span className={classes.text}>
    No member named <span className={classes.textBold}>{filter}</span> could be
    found.
  </span>
)

export default injectSheet(styles)(NoRowsRenderer)
