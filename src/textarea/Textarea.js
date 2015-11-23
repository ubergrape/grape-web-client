import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {REGEX as QUERY_REGEX} from '../query/constants'
import parseQuery from '../query/parse'
import {getTokenUnderCaret} from './utils'

// import {useSheet} from 'grape-web/lib/jss'

// import * as emoji from '../emoji'
// import style from './style'
//


// @useSheet(style)
export default class Textarea extends Component {
  static defaultProps = {

  }

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      objects: {},
      caretPos: 0
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

    this.setState({text: value, caretPos: e.target.selectionEnd})
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
      caretPos: this.refs.textarea.selectionEnd + replacement.content.length
    })
  }

  getTextContent() {
    return this.refs.textarea.value
  }

  onKeyDown() {

  }

  _renderTokens() {

    let str = this.state.text

    Object.keys(this.state.objects).forEach(key => {

      str = str.replace(key, '[[' + key + ']]')

    })

    return (<div>{str}</div>)

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

          {this._renderTokens()}
      </div>
    )
  }
}
