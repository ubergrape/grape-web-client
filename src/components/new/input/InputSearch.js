import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import Input from './Input'
import styles from './styles/InputSearchStyles'

const InputSearch = ({ classes, placeholder, onChange, defaultValue }) => (
  <div className={classes.searchInput}>
    <Input
      onChange={onChange}
      placeholder={placeholder}
      type="search"
      defaultValue={defaultValue}
      styles={{
        padding: '0 16px 0 40px',
      }}
    />
    <div className={classes.search}>
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

InputSearch.propTypes = {
  classes: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

InputSearch.defaultProps = {
  defaultValue: '',
}

export default injectSheet(styles)(InputSearch)
