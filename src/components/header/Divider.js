import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

const styles = ({ palette }) => ({
  divider: {
    display: 'block',
    width: 1,
    height: '100%',
    backgroundImage: `linear-gradient(to bottom, transparent 0%, ${
      palette.text.divider
    } 100%)`,
  },
})

const Divider = ({ classes, className }) => (
  <span className={cn(classes.divider, className)} />
)

export default injectSheet(styles)(Divider)
