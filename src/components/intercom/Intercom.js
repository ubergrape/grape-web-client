import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

@useSheet(style)
export default class Intercom extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    hideSidebar: PropTypes.func.isRequired
  }

  onClose() {
    this.props.hideSidebar()
  }

  render() {
    return (
      <SidebarPanel
        title={"Grape Team"}
        onClose={::this.onClose}/>
    )
  }
}
