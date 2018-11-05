import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import Input from './Input'
import styles from './styles/InputSearchStyles'

const InputSearch = props => (
  <div className={props.classes.searchInput}>
    <button className={props.classes.button} />
    <Input
      onChange={props.onChange}
      placeholder="Search for a person ..."
      type="search"
      defaultValue={props.defaultValue}
    />
  </div>
)

export default injectSheet(styles)(InputSearch)
