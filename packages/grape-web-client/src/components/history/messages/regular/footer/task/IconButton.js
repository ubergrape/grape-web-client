import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import IconButton from 'grape-web/lib/components/icon-button'
import cn from 'classnames'

export default ({ classes, icon, onClick, className }) => (
  <IconButton className={cn(classes.iconButton, className)} onClick={onClick}>
    <Icon name={icon} className={classes.iconButtonIcon} />
  </IconButton>
)
