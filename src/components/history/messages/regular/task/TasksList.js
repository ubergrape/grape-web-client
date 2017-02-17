/* eslint-disable react/no-array-index-key */

import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import List from 'material-ui/List'

import Header from './Header'
import Item from './TaskListItem'

@injectSheet({
  tasksList: {
    width: 260
  },
  list: {
    padding: 0
  }
})
export default class TasksList extends PureComponent {
  render() {
    const {
      classes, description, tasks, onClose, onSelectTask, onRemoveTask
    } = this.props

    return (
      <div className={classes.tasksList}>
        <Header
          title={
            <FormattedMessage
              id="createTask"
              defaultMessage="Create Task"
              description="NLP create task dialog title."
            />
          }
          description={description}
          icon="lightningBolt"
          onClose={onClose}
        />
        <List className={classes.list}>
          {tasks.map((task, i) => (
            <Item
              task={task}
              onSelect={onSelectTask}
              onRemove={onRemoveTask}
              key={i}
            />
          ))}
        </List>
      </div>
    )
  }
}
