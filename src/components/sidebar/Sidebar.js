import React, {Component, PropTypes} from 'react'
import SharedFiles from '../shared-files/SharedFiles'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class Sidebar extends Component {
  static propTypes = {

  }

  constructor() {
    super()
    this.el = null
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.show) {
      case 'files':
        this.el = <SharedFiles {...nextProps} />
        break
      default:
        this.el = null
    }
  }

  render() {
    return (
      <div className={this.props.sheet.classes.sidebar}>
        {this.el}
      </div>
    )
  }
}
