import React, {PropTypes} from 'react'
import Channel from './Channel'

export default function List(props) {
  const {
    theme,
    type,
    title,
    list,
    goToChannel
  } = props

  if (!list.length) return null

  const {classes} = theme
  return (
    <div className={classes.section}>
      <h2 className={`${classes.title} ${classes[type]}`}>{title}</h2>
      <div className={classes.list}>
        {list.map(channel => {
          return (
            <Channel
              {...props}
              key={channel.type + channel.id}
              onClick={() => goToChannel(channel)}
              channel={channel} />
          )
        })}
      </div>
    </div>
  )
}

List.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  goToChannel: PropTypes.func.isRequired
}
