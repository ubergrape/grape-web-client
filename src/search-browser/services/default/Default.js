import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../../../jss'
import style from '../../../browser/style'
import Info from './Info'
import Grid from '../../../grid/Grid'
import Sidebar from '../../../sidebar/Sidebar'
import Detail from '../../detail/Detail'

/**
 * Default search rendering.
 */
@useSheet(style)
export default class Default extends Component {
  static defaultProps = {
    focusedItem: undefined,
    headerHeight: 128
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    let {classes} = this.props.sheet
    let {props} = this
    let sidebarContent

    if (props.focusedItem.type === 'filters') {
      sidebarContent = <Info {...props} />
    }
    else {
      sidebarContent = <Detail {...props} data={props.focusedItem.detail} />
    }

    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <Grid {...props} className={classes.leftColumn} />
          <Sidebar className={classes.rightColumn}>
            {sidebarContent}
          </Sidebar>
        </div>
      </div>
    )
  }
}
