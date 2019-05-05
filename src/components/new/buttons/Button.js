import React from 'react'
import PropTypes from 'prop-types'
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

Button.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  styleType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default injectSheet(styles)(Button)
