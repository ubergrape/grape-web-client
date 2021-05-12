import React from 'react'
import normalize from 'normalize-jss'
import reset from 'reset-jss'
import cn from 'classnames'

import injectSheet from '../../jss'

const options = {
  isolate: false,
  index: -Infinity,
  increaseSpecificity: false,
}

const Normalize = ({ classes, children, className, style }) => (
  <div
    className={cn(classes.normalize, classes.reset, className)}
    style={style}
  >
    {children}
  </div>
)

export default injectSheet({ normalize, reset }, options)(Normalize)
