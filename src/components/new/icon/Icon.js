import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'

import icons from './utils/icons'
import styles from './styles/IconStyles'

const Icon = ({ classes, isHoverable, name }) => (
  <div
    dangerouslySetInnerHTML={{ __html: icons[name] }}
    className={cn(classes.icon, isHoverable ? classes.iconHover : '')}
  />
)

Icon.propTypes = {
  classes: PropTypes.object.isRequired,
  isHoverable: PropTypes.bool,
  name: PropTypes.string.isRequired,
}

Icon.defaultProps = {
  isHoverable: false,
}

export default injectSheet(styles)(Icon)
