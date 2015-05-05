import React from 'react'
import useSheet from 'react-jss'

import * as allStyle from './allStyle'
import Info from './Info'
import List from '../../common/list/List'
import Sidebar from '../../common/sidebar/Sidebar'
import Detail from '../../common/detail/Detail'


/**
 * All search results.
 */
export default React.createClass({
  mixins: [useSheet(allStyle.style)],

  getDefaultProps() {
    return {
      focusedObject: undefined,
      height: undefined
    }
  },

  render() {
    let {classes} = this.sheet
    let {props} = this
    let sidebarContent

    if (props.focusedObject.detail) {
      sidebarContent = <Detail
        data={props.focusedObject.detail}
        headerHeight={allStyle.INFO_HEADER_HEIGHT} />
    }
    else {
      sidebarContent = <Info {...props} headerHeight={allStyle.INFO_HEADER_HEIGHT} />
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
