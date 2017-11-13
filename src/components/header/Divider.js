import React from 'react'
import injectSheet from 'grape-web/lib/jss'

const styles = ({palette}) => ({
  divider: {
    display: 'block',
    width: 1,
    height: '100%',
    backgroundImage: `linear-gradient(to top, ${palette.grey[100]}, rgba(0, 0, 0, 0))`
  }
})

const Divider = ({classes}) => <span className={classes.divider} />

export default injectSheet(styles)(Divider)
