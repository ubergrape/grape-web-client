import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isPeopleLoading, classes }) => (
  <div>
    {isPeopleLoading ? (
      <Text className={classes.loading}>
        <FormattedMessage id="loading" defaultMessage="Loading…" />
      </Text>
    ) : (
      <Text className={classes.notFound}>
        <FormattedMessage
          id="ncdPeopleSearchNotFound"
          defaultMessage="Nice name, but unfortunately nobody could be found."
          description="shown when people search returns 0 results"
        />
      </Text>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isPeopleLoading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
}

export default NoRowsRenderer
