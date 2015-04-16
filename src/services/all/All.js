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
    let {props} = this
    let detail

    if (props.showDetail) {
      detail = <Detail
        data={props.focusedObject.detail}
        height={props.height}
        className={classes.rightColumn}
        ref="detail" />
    }

    return (
      <div className={classes.column}>
        <div className={detail ? classes.row : ''}>
          <List {...props} className={classes.leftColumn} />
          {detail}
        </div>
      </div>
    )
  }
})
