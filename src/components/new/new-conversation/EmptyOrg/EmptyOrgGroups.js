import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './../styles/EmptyOrgStyles'

const EmptyOrgUsers = props => (
  <div>
    <h3 className={props.classes.title}>You are the first!</h3>
    <p className={props.classes.text}>
      No one else has created a group yet, it&#39;s like sitting in front of a
      white paper.
    </p>
    <p className={props.classes.text}>
      Don&#39;t be too stressed and just create the first group around a topic
      that comes to your mind. You can invite other coworkers to this group
      later if you don&#39;t want to chat with yourself.
    </p>
    <button className={props.classes.button}>Create a new group</button>
  </div>
)

export default injectSheet(styles)(EmptyOrgUsers)
