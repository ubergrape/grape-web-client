import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import ColorSwatch from './ColorSwatch/ColorSwatch'
import styles from './styles/ColorPickerStyles'

const ColorPicker = ({ colors, classes, checked, onChange }) => (
  <fieldset className={classes.fieldset}>
    {colors.map((color, i) => (
      <ColorSwatch
        key={color}
        onChange={onChange}
        index={i}
        checked={checked}
        color={color}
      />
    ))}
  </fieldset>
)

ColorPicker.propTypes = {
  colors: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  checked: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default injectSheet(styles)(ColorPicker)
