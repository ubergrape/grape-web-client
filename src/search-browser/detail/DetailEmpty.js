import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './detailEmptyStyle'

/**
 * Empty detail view.
 */
@useSheet(style)
export default class DetailEmpty extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    images: PropTypes.object
  }

  static defaultProps = {
    images: {}
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.empty}>
        <img src={this.props.images.noDetail} />
        <span className={classes.note}>No Detail Infos for this Item</span>
      </div>
    )
  }
}
