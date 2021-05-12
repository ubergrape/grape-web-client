import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'

export default ({ classes, isConnected, className, onClick }) => {
  if (isConnected) {
    return (
      <span
        className={cn(classes.taskIconContainer, className)}
        onClick={onClick}
      >
        <Icon
          name="lightningBolt"
          className={cn(
            classes.taskIconLightningBolt,
            classes.taskIconLightningBoltConnected,
          )}
        />
        <Icon name="checkCircle" className={classes.taskIconCheckCircle} />
      </span>
    )
  }

  return (
    <Icon
      name="lightningBolt"
      className={cn(classes.taskIconLightningBolt, className)}
      onClick={onClick}
    />
  )
}
