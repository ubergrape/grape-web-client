import React from 'react'
import PropTypes from 'prop-types'
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

Status.propTypes = {
  status: PropTypes.number,
  classes: PropTypes.object.isRequired,
}

Status.defaultProps = {
  status: null,
}

export default injectSheet(styles)(Status)
