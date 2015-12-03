import React, {PropTypes, Component} from 'react'

import {REGEX as QUERY_REGEX} from '../query/constants'
import parseQuery from '../query/parse'
import {
  getTokenUnderCaret,
  indexesOf,
  parseAndReplace
} from './utils'

import {escapeRegExp} from 'lodash/string'
import keyname from 'keyname'
import {create} from '../objects'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Textarea extends Component {

  static propTypes = {
    onDidMount: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onAbort: PropTypes.func.isRequired,
    onEditPrevious: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    focused: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    placeholder: '',
    focused: true,
    disabled: false
  }

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      caretPos: 0,
      objects: {},
      textWithObjects: [],
      objectsPositions: {}
    }
  }

  componentDidMount() {
    const {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentDidUpdate() {
    if (this.props.focused) {
      this.refs.textarea.selectionEnd = this.state.caretPos
      this.refs.textarea.focus()
    }
    this.refs.wrapper.style.height = this.refs.highlighter.offsetHeight + 'px'
  }

  onChange(e) {
    const {value, selectionEnd} = e.target
    this.setState({
      text: value,
      textWithObjects: this.getTextAndObjectsRepresentation(this.state.objects, value),
      caretPos: e.target.selectionEnd,
      objectsPositions: this.getObjectsPositions(this.state.objects, value)
    })
    this.props.onChange(this.getQuery(value, selectionEnd))
  }

  onAbort(reason) {
    const {value, selectionEnd} = this.refs.textarea
    const query = this.getQuery(value, selectionEnd)
    this.props.onAbort({reason, query})
  }

  onKeyDown(e) {
    switch (keyname(e.keyCode)) {
      case 'esc':
        this.onAbort('esc')
        e.preventDefault()
        break
      case 'up':
        if (!this.refs.textarea.value) {
          this.props.onEditPrevious()
          e.preventDefault()
        }
        break
      case 'backspace':
        this.onDelete(true, e)
        break
      case 'del':
        this.onDelete(false, e)
        break
      default:
    }
  }

  onKeyPress(e) {
    this.submit(e.nativeEvent)
  }

  // TODO: possibly improve speed with fake caret in highlighter
  // so you can check if caret is inside/near the grape object
  onDelete(direction, e) {
    const str = this.state.text
    const {selectionStart, selectionEnd} = this.refs.textarea
    const objectsPositions = this.state.objectsPositions

    let positionsToDelete

    Object.keys(objectsPositions).some(key => {
      objectsPositions[key].some(positions => {
        if (
          positions[0] <= selectionStart &&
          positions[1] >= selectionEnd
        ) {
          if (
            !direction && positions[1] === selectionEnd ||
            direction && positions[0] === selectionStart
          ) {
            return false
          }
          positionsToDelete = positions
          return true
        }
      })
      if (positionsToDelete) return true
    })

    if (positionsToDelete) {
      e.preventDefault()

      const text = str.slice(0, positionsToDelete[0]) + str.slice(positionsToDelete[1], str.length)

      this.setState({
        text,
        textWithObjects: this.getTextAndObjectsRepresentation(this.state.objects, text),
        objectsPositions: this.getObjectsPositions(this.state.objects, text),
        caretPos: positionsToDelete[0]
      })
    }
  }

  /**
   * Setter for text content.
   *
   * When content passed - set text content and put caret at the end, otherwise
   * clean up the content.
   *
   * @api public
   */
  setTextContent(content) {
    if (!this.props.focused) return false

    const {configs, text} = parseAndReplace(content)

    const objects = {}
    configs.forEach(config => {
      const object = create(config.type, config)
      objects[object.content] = object
    })

    this.setState({
      text,
      objects,
      textWithObjects: this.getTextAndObjectsRepresentation(objects, text),
      caretPos: text.length,
      objectsPositions: this.getObjectsPositions(objects, text)
    })
    return true
  }

  getQuery(value, selectionEnd) {
    const token = getTokenUnderCaret(value, selectionEnd)
    return Boolean(token.text && token.text.match(QUERY_REGEX)) && parseQuery(token.text)
  }

  getTextAndObjectsRepresentation(objects, text) {
    let content
    const keys = Object.keys(objects)

    if (keys.length) {
      const re = new RegExp(keys.map(escapeRegExp).join('|'), 'g')
      const keysInText = text.match(re)
      content = []
      text
        .split(re)
        .forEach((substr, i, arr) => {
          content.push(substr)
          if (i < arr.length - 1) content.push(objects[keysInText[i]])
        })
    } else {
      content = [text]
    }

    return content
  }

  getTextContent() {
    return this.state.text
  }

  getObjectsPositions(objects, text) {
    const objectsPositions = {}

    Object.keys(objects).forEach(key => {
      objectsPositions[key] = indexesOf(key, text)
    })

    return objectsPositions
  }

  addContent(str) {
    this.refs.textarea.value = this.refs.textarea.value + str
    this.onChange({target: this.refs.textarea})
  }

  replaceQuery(replacement) {
    const token = getTokenUnderCaret(
      this.refs.textarea.value,
      this.refs.textarea.selectionEnd
    )

    let text = this.state.text
    const textBefore = text.slice(0, token.position[0])
    const textAfter = text.slice(token.position[1], text.length)

    text = textBefore + replacement.content + textAfter + ' '
    const objects = {...this.state.objects, ...{ [replacement.content]: replacement }}

    this.setState({
      text,
      objects,
      textWithObjects: this.getTextAndObjectsRepresentation(objects, text),
      caretPos: this.refs.textarea.selectionEnd + replacement.content.length,
      objectsPositions: this.getObjectsPositions(objects, text)
    })
  }

  /**
   * Trigger submit event when user hits enter.
   * Do nothing when alt, ctrl, shift or cmd used.
   */
  submit(e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
    if (keyname(e.keyCode) !== 'enter') return

    if (!this.state.text.trim().length) return
    e.preventDefault()

    const textWithObjects = this.state.textWithObjects
    const content = textWithObjects.map(item => item.str ? item.str : item).join('')
    const objects = textWithObjects.reduce((prev, item) => {
      if (typeof item === 'object') {
        prev.push(item.result || item)
      }
      return prev
    }, [])

    const objectsOnly = !textWithObjects
      .filter(item => typeof item === 'string' && item.trim().length)
      .length
    this.props.onSubmit({content, objects, objectsOnly})
  }

  renderTokens() {
    const content = this.state.textWithObjects.map(item => {
      return typeof item === 'object' ?
        (<span className={this.props.sheet.classes.token}>{item.content}</span>) :
        item
    })

    content.push(' ')
    return content
  }

  render() {
    const {common, wrapper, textarea, highlighter} = this.props.sheet.classes

    return (
      <div
        ref="wrapper"
        className={wrapper}>
          <div ref="highlighter" className={highlighter + ' ' + common}>{this.renderTokens()}</div>
          <textarea
            ref="textarea"
            className={textarea + ' ' + common}
            placeholder={this.props.placeholder}
            disabled={this.props.disabled}
            onKeyDown={::this.onKeyDown}
            onKeyPress={::this.onKeyPress}
            onChange={::this.onChange}
            value={this.state.text}
            autoFocus
            ></textarea>

      </div>
    )
  }
}
