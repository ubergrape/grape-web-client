import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'

export default ({ classes, icon, action }) => (
  <div className={classes.action}>
    <div className={classes.iconBorder}>
      <Icon className={classes[icon]} name={icon} />
    </div>
    <span className={classes.actionText}>{action}</span>
  </div>
)
