import React, {PureComponent, PropTypes} from 'react'

import TaskIcon from './TaskIcon'
import IconButton from './IconButton'

export default class TaskListItem extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  onSelect = () => {
    const {task, onSelect} = this.props
    onSelect(task)
  }

  onRemove = () => {
    const {task, onRemove} = this.props
    onRemove(task)
  }

  render() {
    const {classes, task: {isConnected, text}} = this.props

    return (
      <div className={classes.tasksListItem}>
        <TaskIcon
          classes={classes}
          isConnected={isConnected}
          onClick={this.onSelect}
          className={classes.taskListItemIcon}
        />
        <div
          className={classes.tasksListItemText}
          onClick={this.onSelect}
        >
          {text}
        </div>
        <IconButton
          icon="close"
          classes={classes}
          onClick={this.onRemove}
        />
      </div>
    )
  }
}
