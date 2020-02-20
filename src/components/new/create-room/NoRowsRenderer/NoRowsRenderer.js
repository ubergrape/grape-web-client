import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRenderer = ({ classes, isUsersLoaded, filter }) => (
  <>
    {isUsersLoaded ? (
      <span className={classes.text}>
        No member named <span className={classes.textBold}>{filter}</span> could
        be found.
      </span>
    ) : (
      <span className={classes.text}>Loading...</span>
    )}
  </>
)

NoRowsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  isUsersLoaded: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
}

export default injectSheet(styles)(NoRowsRenderer)
