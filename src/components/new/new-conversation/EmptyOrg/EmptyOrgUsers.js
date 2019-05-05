import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import { IconButton } from '../../buttons'
import styles from './../styles/EmptyOrgStyles'

const EmptyOrgUsers = ({ classes, onClick }) => (
  <div>
    <h3 className={classes.title}>Feeling lonely here?</h3>
    <p className={classes.text}>
      It seems that your Grape organization has no other members than you yet.
      Using a messenger is more convenient with several people, so why not
      invite someone. As soon as they join, you can come back and start a
      conversation.
    </p>
    <div className={classes.buttonWrapper}>
      <IconButton name="addPeople" onClick={onClick}>
        Invite members to your organization
      </IconButton>
    </div>
  </div>
)

EmptyOrgUsers.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default injectSheet(styles)(EmptyOrgUsers)
