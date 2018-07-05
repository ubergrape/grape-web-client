/* eslint-disable react/no-array-index-key */

import React from 'react'
import { FormattedMessage } from 'react-intl'
import List from 'grape-web/lib/components/list/list'

import Header from './Header'
import Item from './TaskListItem'

export default ({
  classes,
  description,
  tasks,
  onClose,
  onSelectTask,
  onRemoveTask,
}) => (
  <div className={classes.tasksListView}>
    <Header
      classes={classes}
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
    <List className={classes.tasksList}>
      {tasks.map((task, i) => (
        <Item
          task={task}
          classes={classes}
          onSelect={onSelectTask}
          onRemove={onRemoveTask}
          key={i}
        />
      ))}
    </List>
  </div>
)
