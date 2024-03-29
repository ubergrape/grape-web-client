import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isPeopleLoading, orgName, classes }) => (
  <div>
    {isPeopleLoading ? (
      <Text className={classes.loading}>
        <FormattedMessage id="loading" defaultMessage="Loading…" />
      </Text>
    ) : (
      <Text className={classes.notFound}>
        <FormattedMessage
          id="ncdPeopleSearchNotFound"
          values={{
            orgName,
          }}
          defaultMessage="Nice name, but unfortunately nobody in {orgName} could be found."
          description="shown when people search returns 0 results"
        />
      </Text>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isPeopleLoading: PropTypes.bool.isRequired,
  orgName: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
}

export default NoRowsRenderer
