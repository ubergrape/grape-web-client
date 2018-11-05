import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/NoRowsRendererStyles'

const NoRowsRenderer = props => (
  <div>
    {props.isLoaded ? (
      <div>
        <h3 className={props.classes.title}>Feeling lonely here?</h3>
        <p className={props.classes.text}>
          It seems that your Grape organization has no other members than you
          yet. Using a messenger is more convenient with several people, so why
          invite someone. As soon as they join, you can come back and start a
          conversation.
        </p>
        <button className={props.classes.button}>
          Invite members to your organization
        </button>
      </div>
    ) : null}
  </div>
)

export default injectSheet(styles)(NoRowsRenderer)
