import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/CheckboxStyles'

const Checkbox = ({ classes, checked, onChange, name }) => (
  <label htmlFor={`checkbox-${name}`} className={classes.switch}>
    <input
      id={`checkbox-${name}`}
      onChange={onChange}
      checked={checked}
      className={classes.input}
      type="checkbox"
    />
    <span className={classes.toggle} />
  </label>
)

Checkbox.propTypes = {
  classes: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}

export default injectSheet(styles)(Checkbox)
