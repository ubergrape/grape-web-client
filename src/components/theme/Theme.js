import React, {PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

export default function useTheme(Component, styles, options) {
  function Theme(props) {
    return <Component {...props} theme={props.sheet.classes} />
  }

  Theme.propTypes = {
    sheet: PropTypes.object.isRequired
  }

  return useSheet(Theme, styles, options)
}
