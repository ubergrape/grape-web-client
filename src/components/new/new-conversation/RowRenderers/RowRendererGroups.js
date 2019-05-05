import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import { RoomIcon } from '../../room-icon'
import styles from './../styles/RowRendererStyles'

class RowRendererGroups extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
  }

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
    const { list, style, index, classes } = this.props

    if (list[index].text)
      return (
        <div className={classes.wrapper} style={style}>
          <span className={classes.header}>{list[index].text}</span>
        </div>
      )

    const group = list[index]
    return (
      <button
        className={classes.button}
        onClick={this.onClickRow}
        style={style}
      >
        <div className={classes.avatar}>
          <RoomIcon name={group.icon || 'bulb'} color={group.color} />
          {!group.isPublic && (
            <div className={classes.private}>
              <Icon
                name="lock"
                styles={{
                  position: 'absolute',
                }}
              />
            </div>
          )}
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
