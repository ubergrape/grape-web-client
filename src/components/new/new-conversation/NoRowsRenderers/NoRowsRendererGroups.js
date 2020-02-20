import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRendererGroups = ({ classes, isGroupsLoaded }) => (
  <>
    {isGroupsLoaded ? (
      <span className={classes.text}>
        Nice group name, but unfortunately nobody else created a group named
        like this.
      </span>
    ) : (
      <span className={classes.text}>Loading...</span>
    )}
  </>
)

NoRowsRendererGroups.propTypes = {
  classes: PropTypes.object.isRequired,
  isGroupsLoaded: PropTypes.bool.isRequired,
}

export default injectSheet(styles)(NoRowsRendererGroups)
