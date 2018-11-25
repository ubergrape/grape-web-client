import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import styles from './styles/IconStyles'

import icons from './utils/icons'

const Icon = ({ classes, name }) => (
  <div
    dangerouslySetInnerHTML={{ __html: icons[name] }}
    className={classes.icon}
  />
)

export default injectSheet(styles)(Icon)
