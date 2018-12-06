import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import theme from '../../../constants/theme'
import Input from './Input'
import styles from './styles/InputMultiplePickerStyles'

const InputMultiplePicker = ({
  classes,
  list,
  Item,
  actions,
  onBlur,
  onClick,
  onChange,
}) => (
  <div className={classes.multipleInput}>
    {list.map(item => (
      <Item key={item.id} actions={actions} item={item} />
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

export default injectSheet(styles)(InputMultiplePicker)
