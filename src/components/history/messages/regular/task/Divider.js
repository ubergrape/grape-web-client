import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import BaseDivider from 'material-ui/Divider'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'

const Divider = ({classes}) => <BaseDivider className={classes.divider} />

export default injectSheet({
  divider: {
    height: 2,
    background: grayBlueLighter
  }
})(Divider)
