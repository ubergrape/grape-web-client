import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Flex, Text } from '@ubergrape/aurora-ui'

const Separator = ({ key, style, classes }) => (
  <Flex items="flex-end" key={key} style={style}>
    <Text maxWidth="initial" className={classes.separator} emphasis>
      <FormattedMessage
        id="ncdGroupsSeparator"
        defaultMessage="Groups you belong to"
      />
    </Text>
  </Flex>
)

Separator.propTypes = {
  key: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default Separator
