import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'

import { spacing } from './constants'

const insetSpacing = ({ inset }) => (inset ? spacing : 0)

const styles = ({ palette }) => ({
  root: {
    display: 'block',
    marginBottom: sizes.spacer.m,
    paddingBottom: sizes.spacer.m,
    borderBottom: [1, 'solid', palette.text.divider],
    marginLeft: insetSpacing,
    marginRight: insetSpacing,
  },
})

const Divider = ({ classes }) => <div className={classes.root} />

export default injectSheet(styles)(Divider)
