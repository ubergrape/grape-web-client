import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {REGEX as QUERY_REGEX} from '../query/constants'
import parseQuery from '../query/parse'
import {getTokenUnderCaret, indexesOf} from './utils'

import keyname from 'keyname'

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
      objects: {},
      caretPos: 0,
      objectsPositions: {}
    }
  }

  componentDidMount() {
    let {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentDidUpdate() {
    this.refs.textarea.selectionEnd = this.state.caretPos
  }

  onChange(e) {
    let {value, selectionEnd} = e.target
    let token = getTokenUnderCaret(value, selectionEnd)

    let query = Boolean(token.text && token.text.match(QUERY_REGEX)) && parseQuery(token.text)

    this.setState({
      text: value,
      caretPos: e.target.selectionEnd,
      objectsPositions: this.getObjectsPositions(this.state.objects, value)
    })
    this.props.onChange(query)
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
      caretPos: this.refs.textarea.selectionEnd + replacement.content.length,
      objectsPositions: this.getObjectsPositions(objects, text)
    })
  }

  getObjectsPositions(objects, text) {
    let objectsPositions = {}

    Object.keys(objects).forEach(key => {
      objectsPositions[key] = indexesOf(key, text)
    })

    return objectsPositions
  }

  getTextContent() {
    return this.refs.textarea.value
  }

  onKeyDown(e) {
    let key = keyname(e.keyCode)

    switch (key) {
      case 'backspace':
        this.onDelete(true, e)
        break
      case 'del':
        this.onDelete(false, e)
        break
      default:
    }
  }

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
        objectsPositions: this.getObjectsPositions(this.state.objects, text),
        caretPos: positionsToDelete[0]
      })
    }
  }

  renderTokens() {

    let content = this.state.text
    let keys = Object.keys(this.state.objects)

    if (keys.length) {
      const re = new RegExp(keys.join('|'), 'g')
      const newContent = []
      const keysInText = content.match(re)

      content
        .split(re)
        .forEach((substr, i, arr) => {
          newContent.push(substr)
          if (i < arr.length - 1) newContent.push(<strong>{keysInText[i]}</strong>)
        })
      content = newContent
    }

    return content

  }

  renderToken(match, pos, str) {
    return (
      <span>
        {str.slice(0, pos)}
        <span>{match}</span>
        {str.slice(pos+match.length, str.length)}
      </span>
    )
  }

  render() {
    return (
      <div>
        <textarea
          ref='textarea'
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          focused={this.props.focused}
          onKeyDown={::this.onKeyDown}
          onChange={::this.onChange}
          value={this.state.text}
          ></textarea>

          <div>{this.renderTokens()}</div>
      </div>
    )
  }
}
