import React from 'react'

import Icon from 'grape-web/lib/svg-icons/Icon'
import IconButton from './IconButton'

export default ({ classes, title, description, icon, onPrev, onClose }) => (
  <header className={classes.header}>
    {onPrev && (
      <IconButton
        classes={classes}
        className={classes.headerControlPrev}
        icon="angleLeft"
        onClick={onPrev}
      />
    )}
    <div className={classes.headerContent}>
      <h2 className={classes.headerTitle}>
        {icon && <Icon name={icon} className={classes.headerTitleIcon} />}
        {title}
      </h2>
      <p className={classes.headerDescr}>{description}</p>
    </div>
    {onClose && (
      <IconButton
        classes={classes}
        className={classes.headerControlClose}
        icon="close"
        onClick={onClose}
      />
    )}
  </header>
)
