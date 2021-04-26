import React from 'react'
import PropTypes from 'prop-types'

const RowRendererScrolling = ({ key, style, classes }) => (
  <div style={style} key={key} className={classes.skeleton}>
    <div className={classes.skeletonAvatar} />
    <div className={classes.skeletonText}>
      <div className={classes.skeletonTitle} />
    </div>
  </div>
)

RowRendererScrolling.propTypes = {
  key: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRendererScrolling
