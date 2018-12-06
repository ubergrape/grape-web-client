import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import moment from 'moment'

import { Status } from '../../status'
import styles from './../styles/RowRendererStyles'

class RowRendererUsers extends Component {
  onClickRow = () => {
    const { actions, list, index } = this.props
    const { isActive, pm, id } = list[index]

    actions.onHide()

    if (isActive) {
      actions.goToChannel(pm)
      return
    }

    actions.openPm(id)
  }

  render() {
    const { list, key, style, index, classes } = this.props

    if (list[index].text)
      return (
        <div className={classes.wrapper} key={key} style={style}>
          <span className={classes.header}>{list[index].text}</span>
        </div>
      )

    const user = list[index]
    return (
      <button
        className={classes.button}
        onClick={this.onClickRow}
        key={key}
        style={style}
      >
        <div className={classes.avatar}>
          <img
            className={classes.image}
            src={user.avatar}
            alt={user.displayName}
          />
          <Status status={user.status} />
        </div>
        <div className={classes.text}>
          <span className={classes.name}>{user.displayName}</span>
          <span className={classes.description}>{user.whatIDo}</span>
        </div>
        {user.lastMessageTimestamp && (
          <div className={classes.time}>
            {moment(Date.now()).diff(user.lastMessageTimestamp, 'minutes')}m
          </div>
        )}
      </button>
    )
  }
}

export default injectSheet(styles)(RowRendererUsers)
