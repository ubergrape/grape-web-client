import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import { RoomIcon } from '../../room-icon'
import { Status } from '../../status'
import styles from './../styles/RowRendererStyles'

class RowRendererGroups extends Component {
  onClickRow = () => {
    const { actions, list, index } = this.props
    const { membership, id } = list[index]

    actions.onHide()

    if (!membership) {
      actions.joinChannel(id)
    }

    actions.goToChannel(id)
  }

  render() {
    const { list, key, style, index, classes } = this.props

    if (list[index].text)
      return (
        <div className={classes.wrapper} key={key} style={style}>
          <span className={classes.header}>{list[index].text}</span>
        </div>
      )

    const group = list[index]
    return (
      <button
        className={classes.button}
        onClick={this.onClickRow}
        key={key}
        style={style}
      >
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
}

export default injectSheet(styles)(RowRendererGroups)
