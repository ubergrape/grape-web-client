import React from 'react'
import useSheet from 'react-jss'

import allStyle from './allStyle'
import List from '../../common/list/List'
import Detail from '../../common/detail/Detail'

/**
 * All search results.
 */
export default React.createClass({
  mixins: [useSheet(allStyle)],

  render() {
    let {classes} = this.sheet
    let {detail} = this.refs
    let {props} = this

    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <List {...props} className={classes.leftColumn} />
          <Detail
            data={props.focusedObject}
            height={props.height}
            className={classes.rightColumn}
            ref="detail" />
        </div>
      </div>
    )
  }
})
