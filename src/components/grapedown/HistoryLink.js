import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import {Link} from 'react-router-dom'

import inlineLink from '../button/inlineLink'

const styles = () => ({
  link: {
    ...inlineLink
  }
})

const HistoryLink = ({classes, target, href}) => (
  <Link
    to={href}
    target={target}
    className={classes.link}
  >
    {href}
  </Link>
)

export default injectSheet(styles)(HistoryLink)
