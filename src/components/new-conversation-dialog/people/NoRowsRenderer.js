import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@ubergrape/aurora-ui'

const NoRowsRenderer = ({ isPeopleLoading, classes }) => (
  <div>
    {isPeopleLoading ? (
      <Text className={classes.loading}>Loading...</Text>
    ) : (
      <Text className={classes.notFound}>
        Nice name, but unfortunately nobody could be found.
      </Text>
    )}
  </div>
)

NoRowsRenderer.propTypes = {
  isPeopleLoading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
}

export default NoRowsRenderer
