import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import Input from './Input'
import styles from './styles/InputSearchStyles'

const InputSearch = props => (
  <div className={props.classes.searchInput}>
    <Input
      onChange={props.onChange}
      placeholder={props.placeholder}
      type="search"
      defaultValue={props.defaultValue}
      styles={{
        padding: '0 16px 0 40px',
      }}
    />
    <div className={props.classes.search}>
      <Icon
        name="search"
        styles={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  </div>
)

export default injectSheet(styles)(InputSearch)
