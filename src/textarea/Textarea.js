import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import parseQuery from '../query/parse'
import {getWordUnderCaret} from './utils'

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
    let word = getWordUnderCaret(value, selectionEnd)


    console.log(word)


  //     .split(' ')
  //     .map(item => {
  //       return {
  //         item,
  //         special: this.isItemSpestial(item)
  //       }
  //     })

  //   this.setState({text})
  //   this.props.onChange({query: this.getQuery(text.pop())})
  }

  getQuery(token) {
    if (!token.special) return false

    console.log(parseQuery(token.item))
  }

  isItemSpestial(item) {
    return Boolean(item.match(/^(@|#|:.+:$)/))
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
