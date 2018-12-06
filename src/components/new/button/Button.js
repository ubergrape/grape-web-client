import React from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/ButtonStyles'

const Button = ({ classes, type, styleType, onClick, children }) => (
  <button
    className={cn(classes.button, classes[type], classes[styleType])}
    onClick={onClick}
  >
    {children}
  </button>
)

export default injectSheet(styles)(Button)
