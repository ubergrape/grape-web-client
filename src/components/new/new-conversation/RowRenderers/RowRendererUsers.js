import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import moment from 'moment'

import { Status } from '../../status'
import styles from './../styles/RowRendererStyles'

class RowRendererUsers extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
  }

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
    const { list, style, index, classes } = this.props

    if (list[index].text)
      return (
        <div className={classes.wrapper} style={style}>
          <span className={classes.header}>{list[index].text}</span>
        </div>
      )

    const user = list[index]
    return (
      <button
        className={classes.button}
        onClick={this.onClickRow}
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
