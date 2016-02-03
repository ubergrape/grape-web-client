import React, {PropTypes, Component} from 'react'
import noop from 'lodash/utility/noop'

import keyname from 'keyname'
import TokensInput from '../tokens-input/TokensInput'

export default class GrapeInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onAbort: PropTypes.func,
    onEditPrevious: PropTypes.func,
    onDidMount: PropTypes.func
  }

  static defaultProps = {
    onSubmit: noop,
    onAbort: noop,
    onEditPrevious: noop,
    onDidMount: noop
  }

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

  onWindowResize() {
    // TODO Don'T access state directly.
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
    return (
      <TokensInput
        {...this.props}
        onKeyDown={::this.onKeyDown}
        onDidMount={::this.onDidMount} />
    )
  }
}
