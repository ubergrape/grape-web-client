/* eslint-disable react/no-array-index-key */

import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import List from 'material-ui/List'

import Header from './Header'
import Item from './TaskListItem'

@injectSheet({
  list: {
    padding: 0
  }
})
export default class TasksList extends PureComponent {
  render() {
    const {
      classes, tasks, onClose, onSelectTask, onRemoveTask
    } = this.props

    return (
      <div className={classes.tasksList}>
        <Header
          title={
            <FormattedMessage
              id="tasks"
              defaultMessage="Tasks"
              description="NLP tasks list dialog title."
            />
          }
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
