import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from '../styles/NoRowsRendererStyles'

const NoRowsRenderer = ({ classes, filter }) => (
  <span className={classes.text}>
    No member named <span className={classes.textBold}>{filter}</span> could be
    found.
  </span>
)

NoRowsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
}

export default injectSheet(styles)(NoRowsRenderer)
