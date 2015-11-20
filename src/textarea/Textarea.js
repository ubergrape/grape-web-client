import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {REGEX as QUERY_REGEX} from '../query/constants'
import parseQuery from '../query/parse'
import {getTokenUnderCaret} from './utils'

// import {useSheet} from 'grape-web/lib/jss'

// import * as emoji from '../emoji'
// import style from './style'

// @useSheet(style)
export default class Textarea extends Component {
  static defaultProps = {

  }

  constructor(props) {
    super(props)
    this.state = {
      text: []
    }
  }

  componentDidMount() {
    let {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  componentWillUnmount() {

  }

  onChange(e) {
    let {value, selectionEnd} = e.target
    let token = getTokenUnderCaret(value, selectionEnd)

    this.props.onChange(
      Boolean(token.text && token.text.match(QUERY_REGEX)) &&
      {query: parseQuery(token.text)}
    )
  }


  isQuery(string) {
    return Boolean(string && string.match(/^(@|#|:.+:$)/))
  }

  render() {
    return (
      <div>
        <textarea
          ref='textarea'
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          focused={this.props.focused}
          onChange={::this.onChange}>
          {this.state.text.join(' ')}
        </textarea>
      </div>
    )
  }
}
