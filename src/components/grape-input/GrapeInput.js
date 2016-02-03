import React, {PropTypes, Component} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'

import GlobalEvent from '../global-event/GlobalEvent'
import TokensInput from '../tokens-input/TokensInput'
import Textarea from './Textarea'
import style from './grapeInputStyle'

@useSheet(style)
export default class GrapeInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onAbort: PropTypes.func,
    onEditPrevious: PropTypes.func,
    onDidMount: PropTypes.func,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    onSubmit: noop,
    onAbort: noop,
    onEditPrevious: noop,
    onDidMount: noop,
    Editable: Textarea
  }

  onEnter(e) {
    e.preventDefault()

    // TODO Don'T access state directly.
    const {objects, value} = this.input.state

    const hasText = objects.some(object => {
      return typeof object === 'string' && object.trim().length > 0
    })

    this.props.onSubmit({
      content: value,
      objects,
      objectsOnly: !hasText
    })
  }

  onResizeWindow() {
    // TODO Don't access state directly.
    if (this.input.state.value.trim()) {
      this.forceUpdate()
    }
  }

  onKeyDown(e) {
    const key = keyname(e.keyCode)
    switch (key) {
      case 'esc':
        this.props.onAbort({reason: key})
        e.preventDefault()
        break
      case 'up':
        // TODO Don'T access state directly.
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

  onDidMount(ref) {
    this.input = ref
    this.props.onDidMount(ref)
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <TokensInput
        {...this.props}
        theme={classes}
        onKeyDown={::this.onKeyDown}
        onDidMount={::this.onDidMount}>
          <GlobalEvent event="resize" handler={::this.onResizeWindow} />
      </TokensInput>
    )
  }
}
