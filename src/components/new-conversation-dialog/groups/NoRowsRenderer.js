import React from 'react'
import PropTypes from 'prop-types'

const NoRowsRenderer = ({ isGroupsLoading }) => (
  <div>
    {isGroupsLoading ? (
      <span>Loading...</span>
    ) : (
      <span>
        Nice group name, but unfortunately nobody else created a group named
        like this.
      </span>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isGroupsLoading: PropTypes.bool.isRequired,
}

export default NoRowsRenderer
