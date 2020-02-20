import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import styles from './../styles/RowRendererStyles'

class RowRenderer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    list: PropTypes.array.isRequired,
    checked: PropTypes.bool.isRequired,
    onAddMember: PropTypes.func.isRequired,
    onDeleteMember: PropTypes.func.isRequired,
  }

  onClick = () => {
    const { index, list, onAddMember, onDeleteMember } = this.props

    if (list[index].checked) {
      onDeleteMember(list[index].id)
      return
    }

    onAddMember(list[index])
  }

  render() {
    const { classes, list, checked, index, style } = this.props
    return (
      <button onClick={this.onClick} className={classes.button} style={style}>
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
