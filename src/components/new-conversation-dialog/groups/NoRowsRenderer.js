import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isGroupsLoading, classes }) => (
  <div>
    {isGroupsLoading ? (
      <Text className={classes.loading}>
        <FormattedMessage id="loading" defaultMessage="Loading…" />
      </Text>
    ) : (
      <Text className={classes.groupNotFound}>
        <FormattedMessage
          id="ncdGroupSearchNotFound"
          defaultMessage="Nice group name, but unfortunately nobody else created a group named
        like this."
          description="shown when groups search returns 0 results"
        />
      </Text>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isGroupsLoading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
}

export default NoRowsRenderer
