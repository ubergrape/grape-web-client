import React, { Component, Fragment } from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import styles from './styles/InputStyles'

class Input extends Component {
  componentDidMount() {
    this.input.value = this.props.defaultValue || ''
  }

  onInputRef = input => {
    this.input = input
  }

  render() {
    const {
      type,
      error,
      placeholder,
      classes,
      onChange,
      onClick,
      onFocus,
      onBlur,
    } = this.props

    return (
      <Fragment>
        <input
          type={type}
          ref={this.onInputRef}
          placeholder={placeholder || ''}
          className={cn(classes.input, classes.inputPS)}
          onChange={onChange}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {error && (
          <Icon
            styles={{
              left: 347,
              top: 7,
              position: 'absolute',
            }}
            name="warning"
          />
        )}
        {error && <div className={classes.error}>{error}</div>}
      </Fragment>
    )
  }
}

export default injectSheet(styles)(Input)
