import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import { RoomIcon } from '../../room-icon'
import { Status } from '../../status'
import styles from './../styles/RowRendererStyles'

const RowRendererGroups = ({ data, key, style, index, classes }) => {
  if (data.groups[index].text)
    return (
      <div className={classes.wrapper} key={key} style={style}>
        <span className={classes.header}>{data.groups[index].text}</span>
      </div>
    )

  const group = data.groups[index]
  return (
    <button className={classes.button} key={key} style={style}>
      <div className={classes.avatar}>
        <RoomIcon name={group.icon || 'bulb'} color={group.color} />
        <Status status={group.isPublic ? 'public' : 'private'} />
      </div>
      <div className={classes.text}>
        <span className={classes.name}>{group.name}</span>
        <span className={classes.description}>
          <Icon name="user" />
          &nbsp;
          {group.membersCount}&nbsp;
          {group.description}
        </span>
      </div>
      {group.membership && (
        <Icon
          styles={{
            flex: '0 0 auto',
          }}
          name="userRed"
        />
      )}
    </button>
  )
}

export default injectSheet(styles)(RowRendererGroups)
