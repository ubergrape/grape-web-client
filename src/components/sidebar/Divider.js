import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'

const styles = ({palette}) => ({
  root: {
    display: 'block',
    marginBottom: sizes.spacer.m,
    paddingBottom: sizes.spacer.m,
    borderBottom: [1, 'solid', palette.blueGrey[100]]
  }
})

const Divider = ({classes}) => <div className={classes.root} />

export default injectSheet(styles)(Divider)
