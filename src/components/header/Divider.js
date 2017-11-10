import React from 'react'
import injectSheet from 'grape-web/lib/jss'

const styles = ({palette}) => ({
  divider: {
    display: 'block',
    width: 1,
    height: '100%',
    // TODO change it into expanded version once https://github.com/cssinjs/jss/issues/621
    // is solved
    borderLeft: [1, 'solid'],
    borderImage: `linear-gradient(to top, ${palette.grey[100]}, rgba(0, 0, 0, 0)) 1 100%`
  }
})

const Divider = ({classes}) => <span className={classes.divider} />

export default injectSheet(styles)(Divider)
