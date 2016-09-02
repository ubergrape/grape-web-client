import React, {PropTypes} from 'react'

import LinkWithIcon from '../LinkWithIcon'

export default function LinkAttachment(props) {
  return (
    <LinkWithIcon {...props} icon={props.category} target="_blank" />
  )
}

LinkAttachment.propTypes = {
  category: PropTypes.string.isRequired
}

LinkAttachment.defaultProps = {
  category: 'file'
}
