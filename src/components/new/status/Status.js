import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/StatusStyles'

const Status = ({ status, classes }) => {
  switch (status) {
    case 16:
      return <div className={classes.online} />
    default:
      return null
  }
}

export default injectSheet(styles)(Status)
