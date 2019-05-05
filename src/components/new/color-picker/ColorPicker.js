import React from 'react'
import PropTypes from 'prop-types'

import ColorSwatch from './ColorSwatch/ColorSwatch'

const ColorPicker = ({ colors, checked, onChange }) => (
  <fieldset>
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
  checked: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ColorPicker
