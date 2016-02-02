import React, {PropTypes, Component} from 'react'
import noop from 'lodash/utility/noop'
import escape from 'lodash/string/escape'
import {useSheet} from 'grape-web/lib/jss'

import keyname from 'keyname'
import TokensInput from '../tokens-input/TokensInput'

//import style from './style'

//@useSheet(style)
export default class GrapeInput extends Component {
  constructor(props) {
    super(props)
    this.onWindowResizeBound = ::this.onWindowResize
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResizeBound)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResizeBound)
  }

  onWindowResize() {
    if (this.input.state.value.trim()) this.forceUpdate()
  }

  onAbort(reason) {
    //const {value, selectionEnd} = this.refs.textarea
    //const query = getQuery(value, selectionEnd)
    this.props.onAbort({reason})
  }

  onKeyDown(e) {
    const key = keyname(e.keyCode)
    switch (key) {
      case 'esc':
        this.onAbort(key)
        e.preventDefault()
        break
      case 'up':
        if (!this.input.state.value) {
          this.props.onEditPrevious()
          e.preventDefault()
        }
        break
      case 'enter':
        this.submit(e)
        break
      default:
    }
  }

  onDidMount(ref) {
    this.input = ref
    this.props.onDidMount(ref)
  }

  render() {
    return (
      <TokensInput
        {...this.props}
        onKeyDown={::this.onKeyDown}
        onDidMount={::this.onDidMount} />
    )
  }
}
