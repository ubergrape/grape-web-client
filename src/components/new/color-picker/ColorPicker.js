import React from 'react'

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

export default ColorPicker
