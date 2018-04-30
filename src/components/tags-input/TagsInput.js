import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import keyname from 'keyname'
import debounce from 'lodash/function/debounce'

import {styles} from './theme'

@injectSheet(styles)
export default class TagsInput extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    renderTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    focused: PropTypes.bool.isRequired,
    list: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {filter: ''}
  }

  componentDidMount() {
    if (this.props.focused) this.input.focus()
  }

  componentWillUpdate(prevProps) {
    if (prevProps.list.length !== this.props.list.length) {
      this.setState({filter: ''})
    }
  }

  componentDidUpdate() {
    const {input, filterArea, inputRuler, filterRuler} = this
    if (!input) return
    if (this.props.focused) input.focus()

    // Input can hide first/last few pixels of the text
    // which would not be hidden when rendered in a span.
    // We use span as a ruler.
    // http://s.codepen.io/tyv/debug/pgKJLK
    // http://codepen.io/tyv/pen/pgKJLK
    input.style.width = `${inputRuler.offsetWidth + 2}px`
    input.scrollIntoView()

    filterArea.style.height = filterRuler.offsetHeight
  }

  onInputRef = (ref) => { this.input = ref }
  onInputRulerRef = (ref) => { this.inputRuler = ref }
  onFilterAreaRef = (ref) => { this.filterArea = ref }
  onFilterRulerRef = (ref) => { this.filterRuler = ref }

  onBlur = () => {
    if (this.props.focused) this.input.focus()
  }

  onKeyDown = (e) => {
    if (keyname(e.keyCode) === 'backspace') {
      this.deleteLastItem()
      return
    }
    this.props.onKeyDown(e)
  }

  onChangeDebounced = debounce(() => {
    this.props.onChange(this.input.value)
  }, 200)

  onChange = () => {
    this.setState({filter: this.input.value})
    this.onChangeDebounced()
  }

  onDeleteTag = (item) => {
    this.props.deleteTag(item)
  }

  deleteLastItem() {
    const {list, deleteTag} = this.props
    if (!list.length) return
    const {selectionStart, selectionEnd} = this.input
    if (selectionStart + selectionEnd !== 0) return

    deleteTag(list[list.length - 1])
  }

  renderPlaceholder() {
    const {classes} = this.props.sheet
    const {placeholder, value} = this.props
    const inputValue = this.input ? this.input.value : value
    if (inputValue) return null
    return (
      <span className={classes.placeholder}>{placeholder}</span>
    )
  }

  renderInput() {
    const {
      sheet: {classes}
    } = this.props

    return (
      <span>
        {this.renderPlaceholder()}
        <input
          ref={this.onInputRef}
          className={classes.input}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={this.state.filter}
        />
        <span
          ref={this.onInputRulerRef}
          className={classes.inputRuler}
          aria-hidden
        >
          {this.state.filter}
        </span>
      </span>
    )
  }

  renderTags() {
    const {list, sheet} = this.props
    if (!list.length) return null
    return list.map(item => (
      <button
        key={item.email}
        className={sheet.classes.token}
        onClick={() => this.onDeleteTag(item)}
      >
        {this.props.renderTag(item)}
      </button>
    ))
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div ref={this.onFilterAreaRef} className={classes.filterArea}>
        <div ref={this.onFilterRulerRef} className={classes.filterRuler}>
          {this.renderTags()}
          {this.renderInput()}
        </div>
      </div>
    )
  }
}
