import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import styles from './../styles/RowRendererStyles'

class RowRenderer extends Component {
  onClick = () => {
    const { index, list, onClickCheckedStatus } = this.props
    onClickCheckedStatus(list[index])
  }

  render() {
    const { classes, list, checked, index, key, style } = this.props
    return (
      <button
        onClick={this.onClick}
        className={classes.button}
        key={key}
        style={style}
      >
        <div className={classes.checkbox} checked={checked}>
          {checked && <Icon name="checked" />}
        </div>
        <span className={classes.name}>
          {list[index].displayName}&nbsp;
          <span className={classes.description}>{list[index].whatIDo}</span>
        </span>
      </button>
    )
  }
}

export default injectSheet(styles)(RowRenderer)
