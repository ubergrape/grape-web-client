import PropTypes from 'prop-types'
/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import List from 'grape-web/lib/components/list/list'

import Header from './Header'
import Item from './TaskListItem'

@injectSheet({
  list: {
    padding: 0,
  },
})
export default class TasksList extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tasks: PropTypes.array,
    onClose: PropTypes.func,
    onSelectTask: PropTypes.func,
    onRemoveTask: PropTypes.func,
  }

  static defaultProps = {
    tasks: [],
    onClose: null,
    onSelectTask: null,
    onRemoveTask: null,
  }

  render() {
    const { classes, tasks, onClose, onSelectTask, onRemoveTask } = this.props

    return (
      <div className={classes.tasksList}>
        <Header
          title={
            <FormattedMessage
              id="tasksHeader"
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
