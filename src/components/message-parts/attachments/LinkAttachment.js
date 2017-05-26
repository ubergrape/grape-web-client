import PropTypes from 'prop-types'
import React from 'react'

import LinkWithIcon from '../LinkWithIcon'

export default function LinkAttachment({category, children, ...rest}) {
  return (
    <LinkWithIcon {...rest} icon={category} target="_blank">
      {children}
    </LinkWithIcon>
  )
}

LinkAttachment.propTypes = {
  category: PropTypes.string,
  children: PropTypes.node.isRequired
}

LinkAttachment.defaultProps = {
  category: 'file'
}
