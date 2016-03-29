import {PropTypes, Component, cloneElement} from 'react'

/**
 * Accent mode detector which can be triggered by ~`´^ and maybe
 * more characters.
 * If an Input Method Editor is processing key input and the event is keydown, return 229.
 * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
 */

export default class AccentMode extends Component {
  static propTypes = {
    children: PropTypes.element,
    onAccent: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      value: '',
      active: false
    }
  }

  componentWillReceiveProps() {
    if (this.state.active) return
    this.childrenProps = this.props.children.props
    this.setState({value: this.childrenProps.value})
  }

  componentDidUpdate() {
    if (this.state.active) return
  }

  onKeyDown(e) {
    this.setState({active: e.keyCode === 229})
    this.childrenProps.onKeyDown(e)
  }

  onChange(e) {
    const {value} = e.target
    this.setState({value})
    if (this.state.active) {
      this.props.onAccent(value)
      return
    }
    this.childrenProps.onChange(e)
  }

  setInactive() {
    this.setState({active: false})
  }

  render() {
    return (
      cloneElement(this.props.children, {
        ref: 'editable',
        value: this.state.value,
        onChange: ::this.onChange,
        onKeyDown: ::this.onKeyDown,
        onClick: ::this.setInactive,
        onBlur: ::this.setInactive
      })
    )
  }
}
