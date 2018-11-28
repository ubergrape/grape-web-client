import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import styles from '../styles/ColorSwatchStyles'

class ColorSwatch extends Component {
  onChange = () => {
    const { index, onChange } = this.props
    onChange(index)
  }

  render() {
    const { classes, checked, index, color } = this.props

    return (
      <label htmlFor={`color-${color}`} className={classes.wrapper}>
        <input
          id={`color-${color}`}
          className={classes.circle}
          onChange={this.onChange}
          type="radio"
          value={color}
          name="circle"
          checked={index === checked}
        />
        <div className={classes.checked}>
          <Icon name="checked" />
        </div>
      </label>
    )
  }
}

export default injectSheet(styles)(ColorSwatch)
