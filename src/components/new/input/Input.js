import React, { Component } from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/InputStyles'

class Input extends Component {
  componentDidMount() {
    this.input.value = this.props.defaultValue || ''
  }

  onInputRef = input => {
    this.input = input
  }

  render() {
    const { type, placeholder, classes, onChange } = this.props

    return (
      <input
        type={type}
        ref={this.onInputRef}
        placeholder={placeholder || ''}
        className={cn(classes.input, classes.inputPS)}
        onChange={onChange}
      />
    )
  }
}

export default injectSheet(styles)(Input)
