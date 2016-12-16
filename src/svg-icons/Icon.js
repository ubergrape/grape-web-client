import React, {PropTypes} from 'react'
import cn from 'classnames'
import getColored from './getColored'
import injectSheet from '../jss'

const Icon = ({sheet: {classes}, className, name, color = '#000'}) => (
  <img
    src={getColored({name, color})}
    className={cn(classes.icon, className)} />
)

Icon.propTypes = {
  sheet: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string
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
