import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import Icon from '../icon/Icon'
import Input from './Input'
import styles from './styles/InputSearchStyles'

const InputSearch = props => (
  <div className={props.classes.searchInput}>
    <button className={props.classes.button}>
      <Icon
        name="search"
        styles={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </button>
    <Input
      onChange={props.onChange}
      placeholder={props.placeholder}
      type="search"
      defaultValue={props.defaultValue}
    />
  </div>
)

export default injectSheet(styles)(InputSearch)
