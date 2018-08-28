import PropTypes from 'prop-types'
import React from 'react'

import Channel from './Channel'

export default function List(props) {
  const {
    theme: { classes },
    type,
    title,
    list,
    goToChannel,
  } = props

  if (!list.length) return null

  return (
    <div className={classes.section}>
      <h2 className={`${classes.title} ${classes[type]}`}>{title}</h2>
      <div className={classes.list}>
        {list.map(channel => (
          <Channel
            {...props}
            key={channel.type + channel.id}
            onClick={() => goToChannel(channel)}
            channel={channel}
          />
        ))}
      </div>
    </div>
  )
}

List.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  goToChannel: PropTypes.func.isRequired,
}
