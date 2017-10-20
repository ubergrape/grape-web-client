import React from 'react'
import PropTypes from 'prop-types'

export default function Title({channel, mate, theme}) {
  const title = (
    <h1 className={theme.classes.name}>
      {channel.name || mate.displayName}
    </h1>
  )
  if (!channel.description) return title

  return (
    <div>
      {title}
      <h2 className={theme.classes.description}>
        {channel.description}
      </h2>
    </div>
  )
}

Title.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  mate: PropTypes.shape({
    displayName: PropTypes.string
  }).isRequired,
  theme: PropTypes.shape({
    classes: PropTypes.object
  }).isRequired
}
