import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'

export default ({classes, isConnected}) => {
  if (isConnected) {
    return (
      <span className={classes.taskIconContainer}>
        <Icon name="lightningBolt" className={classes.taskIconLightningBolt} />
        <Icon name="checkCircle" className={classes.taskIconCheckCircle} />
      </span>
    )
  }

  return <Icon name="lightningBolt" className={classes.taskIconLightningBolt} />
}
