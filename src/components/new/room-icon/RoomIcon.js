import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import styles from './styles/RoomIconStyles'

const RoomIcon = ({ classes, name }) => (
  <div className={classes.icon}>
    <Icon name={name} styles={{ fill: 'currentColor', color: 'white' }} />
  </div>
)

export default injectSheet(styles)(RoomIcon)
