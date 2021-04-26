import React from 'react'
import PropTypes from 'prop-types'

const RowRendererScrolling = ({ groups, index, style, classes }) => (
  <div style={style}>
    <div className={classes.skeleton}>
      <div className={classes.skeletonAvatar} />
      <div className={classes.skeletonText}>
        <div className={classes.skeletonTitle} />
        {groups[index].description && (
          <div className={classes.skeletonDescription} />
        )}
      </div>
    </div>
  </div>
)

RowRendererScrolling.propTypes = {
  groups: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRendererScrolling
