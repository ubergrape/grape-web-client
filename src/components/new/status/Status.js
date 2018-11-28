import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import styles from './styles/StatusStyles'

const Status = ({ status, classes }) => {
  switch (status) {
    case 16:
      return <div className={classes.online} />
    case 'private':
      return (
        <div className={classes.private}>
          <Icon
            name="lock"
            styles={{
              position: 'absolute',
            }}
          />
        </div>
      )
    default:
      return null
  }
}

export default injectSheet(styles)(Status)
