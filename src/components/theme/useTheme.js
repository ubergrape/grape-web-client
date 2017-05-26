import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import omit from 'lodash/object/omit'

/**
 * Theming based on https://github.com/kof/theme-standard
 */
export default function useTheme(Component, options = {}) {
  const theme = omit(options, 'styles', 'jss')

  function Theme(props) {
    const {sheet, ...rest} = props
    theme.classes = sheet.classes
    return <Component theme={theme} {...rest} />
  }

  Theme.propTypes = {
    sheet: PropTypes.object.isRequired
  }

  return injectSheet(options.styles, options.jss)(Theme)
}
