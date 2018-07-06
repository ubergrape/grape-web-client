import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import ListItem from 'grape-web/lib/components/list/listItem'

import TaskIcon from './TaskIcon'
import IconButton from './IconButton'

export default class TaskListItem extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  onSelect = () => {
    const { task, onSelect } = this.props
    onSelect(task)
  }

  onRemove = () => {
    const { task, onRemove } = this.props
    onRemove(task)
  }

  render() {
    const {
      classes,
      task: { isConnected, text },
    } = this.props

    return (
      <ListItem className={classes.tasksListItem}>
        <TaskIcon
          classes={classes}
          isConnected={isConnected}
          onClick={this.onSelect}
          className={classes.tasksListItemIcon}
        />

        <div
          className={classes.tasksListItemTextContainer}
          onClick={this.onSelect}
        >
          <span className={classes.tasksListItemText}>{text}</span>
        </div>
        <IconButton icon="close" classes={classes} onClick={this.onRemove} />
      </ListItem>
    )
  }
}
