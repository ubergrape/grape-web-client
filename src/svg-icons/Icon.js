import React, {PropTypes} from 'react'
import cn from 'classnames'

import getColored from './getColored'
import injectSheet from '../jss'

const Icon = ({sheet: {classes}, className, name, color}) => (
  <img
    src={getColored({name, color})}
    className={cn(classes.icon, className)}
    alt=""
  />
)

Icon.propTypes = {
  sheet: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string
}

Icon.defaultProps = {
  color: '#000',
  className: null
}

const styles = {
  icon: {
    display: 'inline-block',
    height: '1em',
    maxWidth: '100%',
    userSelect: 'none'
  }
}

export default injectSheet(styles)(Icon)
