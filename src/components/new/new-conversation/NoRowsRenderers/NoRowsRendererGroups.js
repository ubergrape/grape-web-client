import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRendererGroups = props => (
  <span className={props.classes.text}>
    Nice group name, but unfortunately nobody else created a group named like
    this.
  </span>
)

NoRowsRendererGroups.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectSheet(styles)(NoRowsRendererGroups)
