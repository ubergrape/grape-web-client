import React, { Component } from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'

import styles from './styles/TextareaStyles'

class Input extends Component {
  componentDidMount() {
    this.textarea.value = this.props.defaultValue || ''
  }

  onTextareaRef = textarea => {
    this.textarea = textarea
  }

  render() {
    const { placeholder, classes, onChange } = this.props

    return (
      <textarea
        ref={this.onTextareaRef}
        placeholder={placeholder}
        className={cn(classes.textarea, classes.textareaPS)}
        onChange={onChange}
      />
    )
  }
}

export default injectSheet(styles)(Input)
