import React, {PropTypes, Component} from 'react'
import noop from 'lodash/utility/noop'
import escape from 'lodash/string/escape'
import ReactDOM from 'react-dom'
import {
  getTokenUnderCaret,
  getQuery,
  getObjects,
  getObjectsPositions,
  clearIfLarge,
  updateIfNewEmoji,
  parseAndReplace,
  ensureSpace,
  focus,
  isFocused
} from './utils'

import keyname from 'keyname'
import {create as createObject} from '../objects'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class TokensInput extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onResize: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    sheet: PropTypes.object.isRequired,
    preventSubmit: PropTypes.bool,
    focused: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    Editable: PropTypes.func.isRequired,
    theme: PropTypes.object
  }

  static defaultProps = {
    placeholder: '',
    focused: true,
    disabled: false,
    theme: {},
    onBlur: noop,
    onChange: noop,
    onKeyDown: noop,
    onDidMount: noop,
    onSubmit: noop,
    onResize: noop
  }

  constructor(props) {
    super(props)

    this.initialState = {
      value: '',
      caretAt: 0,
      // TODO We need better names for objectsMap and objects.
      objectsMap: {},
      objects: [],
      objectsPositions: {}
    }
    this.state = {...this.initialState}
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentDidUpdate() {
    this.ensureCaretPosition()
    this.refs.wrapper.style.height = this.refs.highlighter.offsetHeight + 'px'
    // TODO Only call back if really resized.
    this.props.onResize()
  }

  onChange({target}) {
    const {value, selectionEnd} = target
    const objectsMap = updateIfNewEmoji(this.state.objectsMap, value)

    this.setState({
      objectsMap,
      value,
      objects: getObjects(objectsMap, value),
      caretAt: selectionEnd,
      objectsPositions: getObjectsPositions(objectsMap, value)
    })

    this.props.onChange(getQuery(value, selectionEnd))
  }

  onKeyDown(e) {
    const key = keyname(e.keyCode)
    switch (key) {
      case 'backspace':
      case 'del':
        this.onDelete(e, key)
        break
      case 'enter':
        this.setState({...this.initialState})
        break
      default:
    }

    if (!e.defaultPrevented) this.props.onKeyDown(e)
  }

  // TODO: possibly improve speed with fake caret in highlighter
  // so you can check if caret is inside/near the grape object
  onDelete(e, key) {
    const {value, objectsPositions} = this.state
    const {selectionStart, selectionEnd} = ReactDOM.findDOMNode(this.refs.editable)

    let positionsToDelete

    Object.keys(objectsPositions).some(object => {
      objectsPositions[object].some(positions => {
        // Check if carret inside object
        if (
          positions[0] <= selectionStart &&
          positions[1] >= selectionEnd
        ) {
          // If selectionStart or selectionEnd
          // not inside object —> do nothing
          if (
            key === 'del' && positions[1] === selectionEnd ||
            key === 'backspace' && positions[0] === selectionStart
          ) {
            return false
          }
          positionsToDelete = positions
          return true
        }
      })
      if (positionsToDelete) return true
    })

    // Now we know that caret is inside object
    if (positionsToDelete) {
      e.preventDefault()

      const [start, end] = positionsToDelete
      const newValue = `${value.slice(0, start)}${value.slice(end, value.length)}`

      this.setState({
        value: newValue,
        caretAt: start,
        objects: getObjects(this.state.objectsMap, newValue),
        objectsPositions: getObjectsPositions(this.state.objectsMap, newValue)
      })
    }
  }

  /**
   * Setter for text content.
   *
   * When content passed - set text content and put caret at the end, otherwise
   * clean up the content.
   */
  setTextContent(content, options = {}) {
    if (!this.props.focused) return false

    const {configs, value} = parseAndReplace(content)
    const objectsMap = clearIfLarge(this.state.objectsMap)

    configs.forEach(config => {
      const object = createObject(config.type, config)
      objectsMap[object.content] = object
    })

    this.setState({
      value,
      caretAt: value.length,
      objectsMap,
      objects: getObjects(objectsMap, value),
      objectsPositions: getObjectsPositions(objectsMap, value)
    })

    if (!options.silent) this.props.onChange(getQuery(value, value.length))

    return true
  }

  getTextWithMarkdown() {
    return this.state.objects
      .map(item => item.str ? item.str : item)
      .join('')
  }

  ensureCaretPosition() {
    const editable = ReactDOM.findDOMNode(this.refs.editable)

    if (!this.props.focused || isFocused(editable)) return

    focus(editable, () => {
      const {caretAt} = this.state
      editable.selectionStart = caretAt
      editable.selectionEnd = caretAt
    })
  }

  insertQueryString(str) {
    const editable = ReactDOM.findDOMNode(this.refs.editable)
    const {value, selectionEnd} = editable

    let textBefore = value.substring(0, selectionEnd)
    let textAfter = value.substring(selectionEnd)

    if (textBefore) textBefore = ensureSpace('after', textBefore)
    if (textAfter) textAfter = ensureSpace('before', textAfter)
    textBefore += str

    editable.value = textBefore + textAfter
    editable.selectionStart = textBefore.length
    editable.selectionEnd = textBefore.length

    this.onChange({target: editable})
  }

  /**
   * Replace text string to token in state
   */
  replaceQuery(replacement) {
    const editable = ReactDOM.findDOMNode(this.refs.editable)
    const {selectionEnd} = editable

    let {value} = this.state
    const token = getTokenUnderCaret(editable.value, selectionEnd)
    const valueBefore = value.slice(0, token.position[0])
    let valueAfter = value.slice(token.position[1], value.length)
    valueAfter = ensureSpace('before', valueAfter)

    value = valueBefore + replacement.content + valueAfter
    const objectsMap = {
      ...this.state.objectsMap,
      [replacement.content]: replacement
    }
    const caretAt = selectionEnd + replacement.content.length

    this.setState({
      value,
      caretAt,
      objectsMap,
      objects: getObjects(objectsMap, value),
      objectsPositions: getObjectsPositions(objectsMap, value)
    })
  }

  renderTokens() {
    const content = this.state.objects.map((item, index) => {
      if (item.content) return this.renderToken(item, index)

      // Used dangerouslySetInnerHTML to workaround a bug in IE11:
      // https://github.com/ubergrape/chatgrape/issues/3279
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{__html: escape(item)}}>
        </span>
      )
    })

    // Make highlighted height equal content height in editable,
    // because the last item is a space.
    content.push(' ')

    return content
  }

  renderToken(object, index) {
    const {classes} = this.props.sheet
    const {theme} = this.props

    return (
      <span
        key={index}
        className={`${classes.token} ${theme[object.tokenType]}`}>
          {object.content}
      </span>
    )
  }

  render() {
    const {classes} = this.props.sheet
    const {Editable, theme} = this.props

    return (
      <div
        ref="wrapper"
        className={classes.wrapper}
        data-test="highlighted-editable">
        <div
          ref="highlighter"
          className={`${classes.highlighter} ${theme.editable}`}>
          {this.renderTokens()}
        </div>
        <Editable
          ref="editable"
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          onKeyDown={::this.onKeyDown}
          onChange={::this.onChange}
          onBlur={this.props.onBlur}
          value={this.state.value}
          className={theme.editable} />
        {this.props.children}
      </div>
    )
  }
}
