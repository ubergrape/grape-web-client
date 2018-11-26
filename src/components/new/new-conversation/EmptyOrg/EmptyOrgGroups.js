import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './../styles/EmptyOrgStyles'

const EmptyOrgUsers = ({ classes }) => (
  <div>
    <h3 className={classes.title}>You are the first!</h3>
    <p className={classes.text}>
      No one else has created a group yet, it&#39;s like sitting in front of a
      white paper.
    </p>
    <p className={classes.text}>
      Don&#39;t be too stressed and just create the first group around a topic
      that comes to your mind. You can invite other coworkers to this group
      later if you don&#39;t want to chat with yourself.
    </p>
    <button className={classes.button}>Create a new group</button>
  </div>
)

export default injectSheet(styles)(EmptyOrgUsers)
