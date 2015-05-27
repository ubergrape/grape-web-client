import React from 'react'
import useSheet from 'react-jss'

import * as defaultStyle from './defaultStyle'
import Info from './Info'
import Grid from '../../../components/grid/Grid'
import Sidebar from '../../../components/sidebar/Sidebar'
import Detail from '../../../components/object-detail/Detail'

/**
 * Default search rendering.
 */
export default React.createClass({
  mixins: [useSheet(defaultStyle.style)],

  getDefaultProps() {
    return {
      focusedItem: undefined,
      height: undefined,
      images: undefined
    }
  },

  render() {
    let {classes} = this.sheet
    let {props} = this
    let sidebarContent

    if (props.focusedItem.type == 'filters') {
      sidebarContent = <Info {...props} headerHeight={defaultStyle.INFO_HEADER_HEIGHT} />
    }
    else {
      sidebarContent = <Detail
        data={props.focusedItem.detail}
        images={props.images}
        headerHeight={defaultStyle.INFO_HEADER_HEIGHT} />
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
