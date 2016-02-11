import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import style from './serviceStyle'

@useSheet(style)
export default class Service extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    focused: PropTypes.bool,
    item: PropTypes.object,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    onSelect: noop
  }

  render() {
    const {classes} = this.props.sheet
    const {item} = this.props

    return (
      <div
        className={classes.service}
        onClick={this.props.onSelect.bind(null, item)}>
        {item.label}
      </div>
    )
  }
}
