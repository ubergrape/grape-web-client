import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import styles from './MenuStyles'

@useSheet(styles)
export default class Menu extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  static defaultProps = {
    onEdit: noop,
    onCopyLink: noop,
    onRemove: noop
  }

  render() {
    const {sheet, onEdit, onCopyLink, onRemove} = this.props
    const {classes} = sheet

    return (
      <div className={classes.menu}>
        <span className={classes.itemEdit} onClick={onEdit}></span>
        <span className={classes.itemCopyLink} onClick={onCopyLink}></span>
        <span className={classes.itemRemove} onClick={onRemove}></span>
      </div>
    )
  }
}
