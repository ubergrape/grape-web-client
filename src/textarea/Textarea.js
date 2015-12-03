import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {REGEX as QUERY_REGEX} from '../query/constants'
import parseQuery from '../query/parse'
import {
  getTokenUnderCaret,
  indexesOf,
  parseAndReplace,
  parseEmoji,
  isFocused
} from './utils'

import {escapeRegExp} from 'lodash/string'
import debounce from 'lodash/function/debounce'

import keyname from 'keyname'

import {create} from '../objects'

import {useSheet} from 'grape-web/lib/jss'

// import * as emoji from '../emoji'
import style from './style'

@useSheet(style)
export default class Textarea extends Component {
  static defaultProps = {

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
    let {onDidMount} = this.props
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
    let {value, selectionEnd} = e.target
    this.setState({
      text: value,
      textWithObjects: this.getTextAndObjectsRepresentation(this.state.objects, value),
      caretPos: e.target.selectionEnd,
      objectsPositions: this.getObjectsPositions(this.state.objects, value)
    })
    this.props.onChange(this.getQuery(value, selectionEnd))
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

    let objects = {}
    configs.forEach(config => {
      let object = create(config.type, config)
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

  addContent(str) {
    this.refs.textarea.value = this.refs.textarea.value + str
    this.onChange({target: this.refs.textarea})
  }

  replaceQuery(replacement) {
    let token = getTokenUnderCaret(
      this.refs.textarea.value,
      this.refs.textarea.selectionEnd
    )

    let text = this.state.text
    let textBefore = text.slice(0, token.position[0])
    let textAfter = text.slice(token.position[1], text.length)

    text = textBefore + replacement.content + textAfter + ' '
    let objects = {...this.state.objects, ...{ [replacement.content]: replacement }}

    this.setState({
      text,
      objects,
      textWithObjects: this.getTextAndObjectsRepresentation(objects, text),
      caretPos: this.refs.textarea.selectionEnd + replacement.content.length,
      objectsPositions: this.getObjectsPositions(objects, text)
    })
  }

  onAbort(reason) {
    let {value, selectionEnd} = this.refs.textarea
    let query = this.getQuery(value, selectionEnd)
    this.props.onAbort({reason, query})
  }

  getObjectsPositions(objects, text) {
    let objectsPositions = {}

    Object.keys(objects).forEach(key => {
      objectsPositions[key] = indexesOf(key, text)
    })

    return objectsPositions
  }

  getQuery(value, selectionEnd) {
    let token = getTokenUnderCaret(value, selectionEnd)
    return Boolean(token.text && token.text.match(QUERY_REGEX)) && parseQuery(token.text)
  }

  getTextAndObjectsRepresentation(objects, text) {
    let content
    let keys = Object.keys(objects)

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
    let str = this.state.text
    let {selectionStart, selectionEnd} = this.refs.textarea
    let objectsPositions = this.state.objectsPositions

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

      let text = str.slice(0, positionsToDelete[0]) + str.slice(positionsToDelete[1], str.length)

      this.setState({
        text,
        textWithObjects: this.getTextAndObjectsRepresentation(this.state.objects, text),
        objectsPositions: this.getObjectsPositions(this.state.objects, text),
        caretPos: positionsToDelete[0]
      })
    }
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

    let textWithObjects = this.state.textWithObjects

    let content = textWithObjects.map(item => item.str ? item.str : item).join('')

    let objects = textWithObjects.reduce((prev, item) => {
      if (typeof item === 'object') {
        prev.push(item.result || item)
      }
      return prev
    }, [])

    let objectsOnly = !textWithObjects
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
    let {common, wrapper, textarea, highlighter} = this.props.sheet.classes

    return (
      <div
        ref='wrapper'
        className={wrapper}>
          <div ref='highlighter' className={highlighter + ' ' + common}>{this.renderTokens()}</div>
          <textarea
            ref='textarea'
            className={textarea + ' ' + common}
            placeholder={this.props.placeholder}
            disabled={this.props.disabled}
            onKeyDown={::this.onKeyDown}
            onKeyPress={::this.onKeyPress}
            onChange={::this.onChange}
            value={this.state.text}
            autoFocus={true}
            ></textarea>

      </div>
    )
  }
}
