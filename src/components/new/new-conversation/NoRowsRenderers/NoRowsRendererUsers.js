import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRendererUsers = ({ classes, isUsersLoaded }) => (
  <>
    {isUsersLoaded ? (
      <span className={classes.text}>
        Nice name, but unfortunately nobody in your organization could be found.
      </span>
    ) : (
      <span className={classes.text}>Loading...</span>
    )}
  </>
)

NoRowsRendererUsers.propTypes = {
  classes: PropTypes.object.isRequired,
  isUsersLoaded: PropTypes.bool.isRequired,
}

export default injectSheet(styles)(NoRowsRendererUsers)
