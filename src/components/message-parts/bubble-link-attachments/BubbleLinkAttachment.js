import PropTypes from 'prop-types'
import React from 'react'

import LinkWithIcon from '../LinkWithIcon'

export default function BubbleLinkAttachment({
  footerIcon,
  children,
  ...rest
}) {
  // LinkWithIcon is used in other placed. That's why we use a wrapper div
  // for the LinkAttachment. It ensures this has display: block
  let iconName = footerIcon.split('/')
  iconName = iconName[iconName.length - 2].split('_')
  return (
    <div>
      <LinkWithIcon {...rest} icon={iconName[0]} target="_blank">
        {children}
      </LinkWithIcon>
    </div>
  )
}

BubbleLinkAttachment.propTypes = {
  footerIcon: PropTypes.string,
  children: PropTypes.node.isRequired,
}

BubbleLinkAttachment.defaultProps = {
  footerIcon: 'file',
}
