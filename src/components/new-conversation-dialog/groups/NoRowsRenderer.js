import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isGroupsLoading, classes }) => (
  <div>
    {isGroupsLoading ? (
      <Text className={classes.loading}>Loading...</Text>
    ) : (
      <Text className={classes.groupNotFound}>
        Nice group name, but unfortunately nobody else created a group named
        like this.
      </Text>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isGroupsLoading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
}

export default NoRowsRenderer
