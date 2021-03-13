import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isMembersLoading, membersQuery, classes }) => (
  <div>
    {isMembersLoading ? (
      <Text className={classes.loading}>Loading...</Text>
    ) : (
      <Text className={classes.memberNotFound}>
        No member named&nbsp;<Text emphasis>{membersQuery}</Text>&nbsp;could be
        found.
      </Text>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isMembersLoading: PropTypes.bool.isRequired,
  membersQuery: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
}

export default NoRowsRenderer
