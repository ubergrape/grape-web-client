import React, {PropTypes, Component} from 'react'
import noop from 'lodash/utility/noop'
import escape from 'lodash/string/escape'
import {
  getTokenUnderCaret,
  getQuery,
  getObjects,
  getObjectsPositions,
  clearIfLarge,
  updateIfNewEmoji,
  parseAndReplace,
  ensureSpace,
  isFocused,
  focus
} from './utils'

import keyname from 'keyname'
import {create as createObject} from '../objects'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class GrapeInput extends Component {
  static propTypes = {
    onDidMount: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onResize: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    preventSubmit: PropTypes.bool,
    focused: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    placeholder: '',
    focused: true,
    disabled: false,
    onBlur: noop,
    onChange: noop
  }

  constructor(props) {
    super(props)

    this.initialState = {
      value: '',
      caretAt: 0,
      objectsMap: {},
      objects: [],
      objectsPositions: {}
    }
    this.state = {...this.initialState}
  }

  componentDidMount() {
    const {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentDidUpdate() {
    const {textarea} = this.refs
    if (this.props.focused) focus(textarea)

    if (isFocused(textarea)) {
      const {caretAt} = this.state
      textarea.selectionStart = caretAt
      textarea.selectionEnd = caretAt
    }

    this.refs.wrapper.style.height = this.refs.highlighter.offsetHeight + 'px'
    this.props.onResize()
  }


  insertLineBreak() {
    const {textarea} = this.refs
    const {selectionStart} = textarea
    textarea.value =
      textarea.value.substring(0, selectionStart) + '\n' +
      textarea.value.substring(selectionStart)

    textarea.selectionEnd = selectionStart + 1

    this.onChange({target: textarea})
  }

  onChange({target}) {
    const {value, selectionEnd} = target
    const {objectsMap} = this.state

    this.setState({
      objectsMap,
      value,
      objects: getObjects(objectsMap, value),
      caretAt: selectionEnd,
      objectsPositions: getObjectsPositions(objectsMap, value)
    })

    this.props.onChange(getQuery(value, selectionEnd))
  }

  onEnter(e) {
    // Always insert a new line to be consistent across browsers.
    if (e.altKey || e.ctrlKey) {
      e.preventDefault()
      this.insertLineBreak()
    }
  }

  onKeyDown(e) {
    const key = keyname(e.keyCode)
    switch (key) {
      case 'backspace':
      case 'del':
        this.onDelete(e, key)
        break
      case 'enter':
        this.onEnter(e)
        break
      default:
    }

    if (!e.defaultPrevented) this.props.onKeyDown(e)
  }

  // TODO: possibly improve speed with fake caret in highlighter
  // so you can check if caret is inside/near the grape object
  onDelete(e, key) {
    const {value, objectsPositions} = this.state
    const {selectionStart, selectionEnd} = this.refs.textarea

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

  insertQueryString(str) {
    const {textarea} = this.refs
    const {value, selectionEnd} = textarea

    let textBefore = value.substring(0, selectionEnd)
    let textAfter = value.substring(selectionEnd)

    if (textBefore) textBefore = ensureSpace('after', textBefore)
    if (textAfter) textAfter = ensureSpace('before', textAfter)
    textBefore += str

    textarea.value = textBefore + textAfter
    textarea.selectionStart = textBefore.length
    textarea.selectionEnd = textBefore.length

    this.onChange({target: textarea})
  }

  /**
   * Replace text string to token in state
   */
  replaceQuery(replacement) {
    const {textarea} = this.refs
    const {selectionEnd} = textarea

    let {value} = this.state
    const token = getTokenUnderCaret(textarea.value, selectionEnd)
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

    // Make highlighted height equal content height in textarea,
    // because the last item is a space.
    content.push(' ')

    return content
  }

  renderToken(object, index) {
    const {token, user, room, search, emoji} = this.props.sheet.classes

    let tokenType
    switch (object.tokenType) {
      case 'user':
        tokenType = user
        break
      case 'room':
        tokenType = room
        break
      case 'search':
        tokenType = search
        break
      case 'emoji':
        tokenType = emoji
        break
      default:
        tokenType = ''
    }

    return (
      <span
        key={index}
        className={`${token} ${tokenType}`}>
          {object.content}
      </span>
    )
  }

  renderHighlighter() {
    const {common, highlighter} = this.props.sheet.classes
    return (
      <div
        ref="highlighter"
        className={`${highlighter} ${common}`}>
          {this.renderTokens()}
      </div>
    )
  }

  render() {
    const {common, wrapper, textarea} = this.props.sheet.classes

    return (
      <div
        ref="wrapper"
        className={wrapper}
        data-test="highlighted-textarea">
          {this.renderHighlighter()}
          <textarea
            ref="textarea"
            className={`${textarea} ${common}`}
            placeholder={this.props.placeholder}
            disabled={this.props.disabled}
            onKeyDown={::this.onKeyDown}
            onChange={::this.onChange}
            onBlur={this.props.onBlur}
            value={this.state.value}
            autoFocus></textarea>
      </div>
    )
  }
}
