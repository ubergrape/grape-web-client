import React, {PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import omit from 'lodash/object/omit'

/**
 * Theming based on https://github.com/kof/theme-standard
 */
export default function useTheme(Component, options = {}) {
  const theme = omit(options, 'styles', 'jss')

  function Theme(props) {
    theme.classes = props.sheet.classes
    return <Component theme={theme} {...props} />
  }

  Theme.propTypes = {
    sheet: PropTypes.object.isRequired
  }

  return useSheet(Theme, options.styles, options.jss)
}
