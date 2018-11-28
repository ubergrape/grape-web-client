import React from 'react'
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

export default injectSheet(styles)(Checkbox)
