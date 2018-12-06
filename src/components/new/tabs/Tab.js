import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/TabStyles'

class Tab extends Component {
  componentDidMount() {
    const { tab, isCurrentTab } = this.props
    if (isCurrentTab) tab.onLoad()
  }

  handleClick = () => {
    const { index, handleClick, isCurrentTab, tab } = this.props
    if (isCurrentTab) return
    handleClick(index)
    tab.onChange()
  }

  render() {
    const { name, isCurrentTab, classes, disabled } = this.props
    return (
      <li className={classes.tab}>
        <button
          disabled={disabled}
          className={`${classes.buttonLarge} ${
            isCurrentTab ? classes.buttonActive : ''
          }`}
          onClick={this.handleClick}
        >
          {name}
        </button>
      </li>
    )
  }
}

export default injectSheet(styles)(Tab)