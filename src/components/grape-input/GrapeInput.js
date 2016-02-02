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

  /**
   * Trigger submit event when user hits enter.
   * Do nothing when alt, ctrl, shift or cmd used.
   */
  onEnter(e) {
    // We relay on default browser behaviour here, which normally means:
    // insert a new line.
    if (e.metaKey || e.shiftKey) return

    const {value} = this.input.state

    // Do nothing if user tries to submit an empty text.
    if (!value.trim()) {
      e.preventDefault()
      return
    }

    e.preventDefault()

    const {objects} = this.input.state

    const hasText = objects.some(object => {
      return typeof object === 'string' && object.trim().length > 0
    })

    this.props.onSubmit({
      content: value,
      objects,
      objectsOnly: !hasText
    })
    this.setState({...this.initialState})
  }

  onWindowResize() {
    if (this.input.state.value.trim()) this.forceUpdate()
  }

  onKeyDown(e) {
    const key = keyname(e.keyCode)
    switch (key) {
      case 'esc':
        this.props.onAbort({reason: key})
        e.preventDefault()
        break
      case 'up':
        if (!this.input.state.value) {
          this.props.onEditPrevious()
          e.preventDefault()
        }
        break
      case 'enter':
        this.onEnter(e)
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
