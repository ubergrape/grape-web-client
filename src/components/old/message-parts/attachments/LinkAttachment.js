import PropTypes from 'prop-types'
import React from 'react'

import LinkWithIcon from '../LinkWithIcon'

export default function LinkAttachment({ category, children, ...rest }) {
  // LinkWithIcon is used in other placed. That's why we use a wrapper div
  // for the LinkAttachment. It ensures this has display: block
  return (
    <div>
      <LinkWithIcon {...rest} icon={category} target="_blank">
        {children}
      </LinkWithIcon>
    </div>
  )
}

LinkAttachment.propTypes = {
  category: PropTypes.string,
  children: PropTypes.node.isRequired,
}

LinkAttachment.defaultProps = {
  category: 'file',
}
