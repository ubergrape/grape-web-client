import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from '../../../browser/style'
import Grid from '../../../grid/Grid'
import Sidebar from '../../../sidebar/Sidebar'
import Detail from '../../detail/Detail'
import {listTypes} from '../../../../constants/searchBrowser'

/**
 * Default search rendering.
 */
@useSheet(style)
export default class Default extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    focusedItem: PropTypes.object,
    focusedList: PropTypes.oneOf(listTypes)
  }

  render() {
    const {classes} = this.props.sheet
    const {focusedItem} = this.props

    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <Grid
            {...this.props}
            className={classes.leftColumn}
            focused={this.props.focusedList === 'objects'} />
          <Sidebar className={classes.rightColumn}>
            <Detail {...this.props} data={focusedItem && focusedItem.detail} />
          </Sidebar>
        </div>
      </div>
    )
  }
}
