import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { noop } from 'lodash'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../icon'
import styles from './styles/InputStyles'

class Input extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string,
    error: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    defaultValue: '',
    type: 'text',
    onKeyDown: noop,
    onChange: noop,
  }

  static defaultProps = {
    error: undefined,
  }

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
      onKeyDown,
    } = this.props

    return (
      <Fragment>
        <input
          type={type}
          ref={this.onInputRef}
          placeholder={placeholder || ''}
          className={cn(classes.input, classes.inputPS)}
          onChange={onChange}
          onKeyDown={onKeyDown}
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
