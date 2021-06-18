import PropTypes from 'prop-types'
import React from 'react'

export default function Highlight({ children, theme }) {
  return <span className={theme.classes.highlight}>{children}</span>
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object.isRequired,
}
