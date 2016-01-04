import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
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
  static propTypes = {
    sheet: PropTypes.object,
    focusedItem: PropTypes.object
  }

  static defaultProps = {
    headerHeight: 128
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {classes} = this.props.sheet
    let sidebarContent

    if (this.props.focusedItem.type === 'filters') {
      sidebarContent = <Info {...this.props} />
    } else {
      sidebarContent = <Detail {...this.props} data={this.props.focusedItem.detail} />
    }

    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <Grid {...this.props} className={classes.leftColumn} />
          <Sidebar className={classes.rightColumn}>
            {sidebarContent}
          </Sidebar>
        </div>
      </div>
    )
  }
}
