/* eslint-disable react/no-array-index-key */

import React from 'react'
import {FormattedMessage} from 'react-intl'

import Header from './Header'

const Body = ({classes, children}) => (
  <div className={classes.body}>
    {children}
  </div>
)

export default ({classes, description, tasks, onClose}) => (
  <div className={classes.content}>
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
      <Body classes={classes} key={i}>
        {task.text}
      </Body>
    ))}
  </div>
)
