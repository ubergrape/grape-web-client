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
    onChange: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.childrenProps = nextProps.children.props
    this.setState({
      value: this.childrenProps.value
    })
  }

  onKeyDown(e) {
    this.props.onChange(e.keyCode === 229)
    this.childrenProps.onKeyDown(e)
  }

  onEditableChange({target}) {
    const {value} = target
    this.setState({value})
    this.childrenProps.onChange(value)
  }

  setInactive() {
    this.props.onChange(false)
  }

  render() {
    return (
      cloneElement(this.props.children, {
        value: this.state.value,
        onChange: ::this.onEditableChange,
        onKeyDown: ::this.onKeyDown,
        onClick: ::this.setInactive,
        onBlur: ::this.setInactive
      })
    )
  }
}
