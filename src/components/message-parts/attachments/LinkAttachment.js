import React, {PropTypes} from 'react'

export default function LinkAttachment(props) {
  const {url, name} = props
  return <a href={url} target="_blank">{name}</a>
}

LinkAttachment.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired
}
