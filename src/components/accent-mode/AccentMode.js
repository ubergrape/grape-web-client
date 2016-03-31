import {PropTypes, Component, cloneElement} from 'react'
import noop from 'lodash/utility/noop'

/**
 * Accent mode detector which can be triggered by ~`´^ and maybe
 * more characters.
 * If an Input Method Editor is processing key input and the event is keydown, return 229.
 * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
 */
export default class AccentMode extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: noop
  }

  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.childProps = nextProps.children.props
    this.setState({
      value: this.childProps.value
    })
  }

  onKeyDown(e) {
    this.props.onChange(e.keyCode === 229)
    this.childProps.onKeyDown(e)
  }

  onEditableChange(e) {
    this.setState({
      value: e.target.value
    })
    this.childProps.onChange(e)
  }

  onExit() {
    this.props.onChange(false)
  }

  render() {
    return (
      cloneElement(this.props.children, {
        value: this.state.value,
        onChange: ::this.onEditableChange,
        onKeyDown: ::this.onKeyDown,
        onClick: ::this.onExit,
        onBlur: ::this.onExit
      })
    )
  }
}
