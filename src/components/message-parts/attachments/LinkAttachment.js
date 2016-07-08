import React, {PropTypes} from 'react'
import pick from 'lodash/object/pick'

import LinkWithIcon from '../LinkWithIcon'

export default function LinkAttachment(props) {
  return (
    <LinkWithIcon
      {...pick(props, Object.keys(LinkWithIcon.propTypes))}
      icon={props.category} />
  )
}

LinkAttachment.propTypes = {
  category: PropTypes.string.isRequired
}
