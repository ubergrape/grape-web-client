import React from 'react'
import useSheet from 'react-jss'

import allStyle from './allStyle'
import Info from './Info'
import List from '../../common/list/List'
import Sidebar from '../../common/sidebar/Sidebar'
import Detail from '../../common/detail/Detail'
import * as detailStyle from '../../common/detail/detailStyle'

/**
 * All search results.
 */
export default React.createClass({
  mixins: [useSheet(allStyle)],

  getDefaultProps() {
    return {
      data: null,
      focusedObject: undefined,
      hasIntegrations: undefined,
      canAddIntegrations: undefined,
      height: null,
      onFocus: null,
      onSelect: null
    }
  },

  render() {
    let {classes} = this.sheet
    let {props} = this
    let sidebarContent

    if (props.focusedObject.detail) {
      sidebarContent = <Detail data={props.focusedObject.detail} />
    }
    else {
      sidebarContent = <Info {...props} headerHeight={detailStyle.HEADER_HEIGHT}/>
    }

    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <List {...props} className={classes.leftColumn} />
          <Sidebar content={sidebarContent} height={props.height} className={classes.rightColumn} />
        </div>
      </div>
    )
  }
})
