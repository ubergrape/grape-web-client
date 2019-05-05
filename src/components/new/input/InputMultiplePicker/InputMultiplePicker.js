import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import theme from '../../../../constants/theme'
import Input from '../Input'
import InputMultiplePickerItem from './InputMultiplePickerItem'
import styles from '../styles/InputMultiplePickerStyles'

const InputMultiplePicker = ({
  classes,
  list,
  actions,
  onBlur,
  onClick,
  onChange,
}) => (
  <div className={classes.multipleInput}>
    {list.map(item => (
      <InputMultiplePickerItem key={item.id} actions={actions} item={item} />
    ))}
    <Input
      placeholder="Search people ..."
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onClick}
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

InputMultiplePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default injectSheet(styles)(InputMultiplePicker)
