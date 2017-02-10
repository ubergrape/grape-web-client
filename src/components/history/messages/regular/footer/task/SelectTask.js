import React from 'react'

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
      title="Create Task"
      description={description}
      icon="lightningBolt"
      onClose={onClose}
    />
    {tasks.map(task => (
      <Body classes={classes}>
        {task.text}
      </Body>
    ))}
  </div>
)
