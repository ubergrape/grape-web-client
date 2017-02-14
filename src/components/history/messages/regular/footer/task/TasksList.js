/* eslint-disable react/no-array-index-key */

import React from 'react'
import {FormattedMessage} from 'react-intl'

import Header from './Header'
import Section from './Section'
import Item from './TaskListItem'

export default ({classes, description, tasks, onClose, onSelectTask, onRemoveTask}) => (
  <div className={classes.tasksList}>
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
    {tasks.map((task, i) => (
      <Section classes={classes} key={i}>
        <Item
          task={task}
          classes={classes}
          onSelect={onSelectTask}
          onRemove={onRemoveTask}
        />
      </Section>
    ))}
  </div>
)
