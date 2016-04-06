import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import keyname from 'keyname'

@useSheet(style)
export default class TagsInput extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    renderTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    focused: PropTypes.bool,
    list: PropTypes.array,
    value: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string
  }

  componentDidMount() {
    if (this.props.focused) this.refs.input.focus()
  }

  componentDidUpdate() {
    const {input, ruler} = this.refs
    if (!input) return
    if (this.props.focused) input.focus()

    // Input can hide first/last few pixels of the text
    // which would not be hidden when rendered in a span.
    // We use span as a ruler.
    // http://s.codepen.io/tyv/debug/pgKJLK
    // http://codepen.io/tyv/pen/pgKJLK
    input.style.width = `${ruler.offsetWidth + 2}px`
    input.scrollIntoView()
  }

  onBlur() {
    if (this.props.focused) this.refs.input.focus()
  }

  onKeyDown(e) {
    if (keyname(e.keyCode) === 'backspace') {
      this.deleteLastItem()
      return
    }
    this.props.onKeyDown(e)
  }

  onChange() {
    this.props.onChange(this.refs.input.value)
  }

  onDeleteTag(item) {
    this.props.deleteTag(item)
  }

  deleteLastItem() {
    const {list, deleteTag} = this.props
    if (!list.length) return
    const {selectionStart, selectionEnd} = this.refs.input
    if (selectionStart + selectionEnd !== 0) return

    deleteTag(list[list.length - 1])
  }

  renderPlaceholder() {
    const {classes} = this.props.sheet
    const {placeholder, value, list} = this.props
    if (!placeholder || value || list.length) return null
    return (
      <span className={classes.placeholder}>{placeholder}</span>
    )
  }

  renderInput() {
    const {classes} = this.props.sheet
    const {focused, value} = this.props
    if (!focused) return null

    return (
      <span>
        {this.renderPlaceholder()}
        <input
          ref="input"
          className={classes.input}
          onBlur={::this.onBlur}
          onKeyDown={::this.onKeyDown}
          onChange={::this.onChange}
          value={value} />
        <span
          ref="ruler"
          className={classes.ruler}
          ariaHidden>
          {value}
        </span>
      </span>
    )
  }

  renderTags() {
    const {list, sheet} = this.props
    if (!list.length) return null
    return list.map((item, i) => {
      return (
        <button
          key={i}
          className={sheet.classes.token}
          onClick={this.onDeleteTag.bind(this, item)}>
          {this.props.renderTag(item)}
        </button>
      )
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.renderTags()}
        {this.renderInput()}
      </div>
    )
  }
}
