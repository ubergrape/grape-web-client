import React from 'react'
import injectSheet from 'grape-web/lib/jss'

const styles = ({palette}) => ({
  root: {
    display: 'block',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: [1, 'solid', palette.blueGrey[100]]
  }
})

const Divider = ({classes}) => <div className={classes.root} />

export default injectSheet(styles)(Divider)
