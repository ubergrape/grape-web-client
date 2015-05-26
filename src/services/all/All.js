import React from 'react'
import useSheet from 'react-jss'

import * as allStyle from './allStyle'
import Info from './Info'
import Grid from '../../components/grid/Grid'
import Sidebar from '../../components/sidebar/Sidebar'
import Detail from '../../components/detail/Detail'


/**
 * All search results.
 */
export default React.createClass({
  mixins: [useSheet(allStyle.style)],

  getDefaultProps() {
    return {
      focusedObject: undefined,
      height: undefined,
      images: undefined
    }
  },

  render() {
    let {classes} = this.sheet
    let {props} = this
    let sidebarContent

    if (props.focusedObject.type == 'filters') {
      sidebarContent = <Info {...props} headerHeight={allStyle.INFO_HEADER_HEIGHT} />
    }
    else {
      sidebarContent = <Detail
        data={props.focusedObject.detail}
        images={props.images}
        headerHeight={allStyle.INFO_HEADER_HEIGHT} />
    }
       
    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <Grid {...props} className={classes.leftColumn} />
          <Sidebar content={sidebarContent} height={props.height} className={classes.rightColumn} />
        </div>
      </div>
    )
  }
})
