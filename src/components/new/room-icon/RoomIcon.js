import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import styles from './styles/RoomIconStyles'

const RoomIcon = ({ classes, name }) => (
  <div className={classes.icon}>
    <Icon name={name} styles={{ fill: 'currentColor', color: 'white' }} />
  </div>
)

RoomIcon.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
}

export default injectSheet(styles)(RoomIcon)
