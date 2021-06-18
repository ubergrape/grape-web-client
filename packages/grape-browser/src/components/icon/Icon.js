import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { shouldPureComponentUpdate } from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import style from './style'

/**
 * Styled icon component.
 */
class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    sheet: PropTypes.object.isRequired,
    style: PropTypes.object,
    name: PropTypes.string,
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (
      <i
        className={this.props.className || this.props.sheet.classes.icon}
        style={this.props.style}
        title={this.props.name}
        data-object={this.props.name}
      />
    )
  }
}

export default injectSheet(style)(Icon)
