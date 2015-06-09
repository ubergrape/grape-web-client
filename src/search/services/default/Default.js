import React from 'react'
import useSheet from 'react-jss'

import style from '../../../components/browser/style'
import Info from './Info'
import Grid from '../../../components/grid/Grid'
import Sidebar from '../../../components/sidebar/Sidebar'
import Detail from '../../detail/Detail'

/**
 * Default search rendering.
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      focusedItem: undefined,
      height: undefined,
      images: undefined,
      headerHeight: 128
    }
  },

  render() {
    let {classes} = this.sheet
    let {props} = this
    let sidebarContent

    if (props.focusedItem.type == 'filters') {
      sidebarContent = <Info {...props} />
    }
    else {
      sidebarContent = <Detail {...props} data={props.focusedItem.detail} />
    }
       
    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <Grid {...props} className={classes.leftColumn} />
          <Sidebar content={sidebarContent} className={classes.rightColumn} />
        </div>
      </div>
    )
  }
})
