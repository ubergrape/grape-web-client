import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRendererUsers = ({ classes }) => (
  <span className={classes.text}>
    Nice name, but unfortunately nobody in your organization could be found.
  </span>
)

NoRowsRendererUsers.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectSheet(styles)(NoRowsRendererUsers)
