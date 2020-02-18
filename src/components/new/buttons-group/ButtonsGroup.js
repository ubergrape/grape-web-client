import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/ButtonsGroupStyles'

const ButtonsGroup = ({ classes, children }) => (
  <>
    {children.map(child => (
      <div key={child.props.children} className={classes.button}>
        {child}
      </div>
    ))}
  </>
)

ButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

export default injectSheet(styles)(ButtonsGroup)
