import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isMembersLoading, membersQuery, classes }) => (
  <div>
    {isMembersLoading ? (
      <Text className={classes.loading}>
        <FormattedMessage id="loading" defaultMessage="Loading…" />
      </Text>
    ) : (
      <Text className={classes.memberNotFound}>
        <FormattedMessage
          id="ncdCreateRoomPeopleSearchNotFound"
          defaultMessage="No member named {searchTerm} could be found."
          description="shown when people search in create room dialog returns 0 results"
          values={{
            searchTerm: <Text emphasis>{membersQuery}</Text>,
          }}
        />
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
