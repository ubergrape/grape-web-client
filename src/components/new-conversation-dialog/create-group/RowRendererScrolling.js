import React from 'react'
import PropTypes from 'prop-types'

const RowRendererScrolling = ({ style, classes }) => (
  <div style={style}>
    <div className={classes.skeleton}>
      <div className={classes.skeletonAvatar} />
      <div className={classes.skeletonText}>
        <div className={classes.skeletonTitle} />
      </div>
    </div>
  </div>
)

RowRendererScrolling.propTypes = {
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRendererScrolling
