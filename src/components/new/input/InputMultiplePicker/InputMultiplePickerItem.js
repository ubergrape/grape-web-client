import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import styles from '../styles/InputMultiplePickerItemStyles'

class InputMultiplePickerItem extends Component {
  onClick = () => {
    const { item, onDeleteMember } = this.props
    onDeleteMember(item.id)
  }

  render() {
    const { classes, item } = this.props
    return (
      <button className={classes.item} key={item.id} onClick={this.onClick}>
        {item.displayName}{' '}
        <Icon
          name="cross"
          styles={{ margin: '0 4px 0 12px', pointerEvents: 'none' }}
        />
      </button>
    )
  }
}

InputMultiplePickerItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  onDeleteMember: PropTypes.func.isRequired,
}

export default injectSheet(styles)(InputMultiplePickerItem)
