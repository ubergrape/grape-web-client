import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

import {maxSize} from './constants'

const limit = maxSize / 1000 / 1000

export default function FileTooBig({files}) {
  if (files.length > 1) {
    return (
      <FormattedMessage
        id="filesAreTooBig"
        defaultMessage='Files "{names}" exceed size limit of {limit}Mb.'
        values={{
          limit,
          names: files.map(({name}) => name).join(', ')
        }} />
    )
  }

  return (
    <FormattedMessage
      id="fileTooBig"
      defaultMessage='File "{name}" exceeds size limit of {limit}Mb.'
      values={{
        limit,
        name: files[0].name
      }} />
  )
}

FileTooBig.propTypes = {
  files: PropTypes.array.isRequired
}
