import React from 'react'

import Header from '../../../message-parts/Header'

export default ({ sheet, classes, time, userTime, author, onClickAuthor }) => (
  <div className={classes.row}>
    <div className={classes.avatarColumn} />
    <Header
      time={time}
      userTime={userTime}
      author={author.name}
      theme={sheet}
      onClickAuthor={onClickAuthor}
    />
  </div>
)
