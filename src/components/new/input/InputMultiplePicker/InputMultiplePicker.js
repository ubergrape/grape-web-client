import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import theme from '../../../../constants/theme'
import Input from '../Input'
import InputMultiplePickerItem from './InputMultiplePickerItem'
import styles from '../styles/InputMultiplePickerStyles'

class InputMultiplePicker extends Component {
  onKeyDown = e => {
    const { list, value, onDeleteMember } = this.props
    if (e.keyCode === 8) {
      if (!value && list.length) onDeleteMember(list[list.length - 1].id)
    }
  }

  render() {
    const { classes, list, onDeleteMember, onChange } = this.props

    return (
      <div className={classes.multipleInput}>
        {list.map(item => (
          <InputMultiplePickerItem
            key={item.id}
            onDeleteMember={onDeleteMember}
            item={item}
          />
        ))}
        <Input
          placeholder="Search people ..."
          onKeyDown={this.onKeyDown}
          onChange={onChange}
          styles={{
            width: 'auto',
            border: '0',
            minWidth: 160,
            flexGrow: 100,
            height: 24,
            borderRadius: 12,
            padding: '1px 1px 1px 3px',
            margin: '2px 4px',
            color: theme.colorTextBase,
            fontSize: 14,
          }}
        />
      </div>
    )
  }
}

InputMultiplePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDeleteMember: PropTypes.func.isRequired,
}

export default injectSheet(styles)(InputMultiplePicker)
