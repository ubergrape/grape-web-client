import PropTypes from 'prop-types'
import {Component, cloneElement} from 'react'
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

  constructor(props) {
    super(props)
    this.state = {value: props.children.props.value}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.children.props.value})
  }

  onKeyDown = (e) => {
    this.props.onChange(e.keyCode === 229)
    this.props.children.props.onKeyDown(e)
  }

  onEditableChange = (e) => {
    this.setState({
      value: e.target.value
    })
    this.props.children.props.onChange(e)
  }

  onExit = () => {
    this.props.onChange(false)
  }

  onBlur = () => {
    this.props.children.props.onBlur()
    this.onExit()
  }

  render() {
    return (
      cloneElement(this.props.children, {
        value: this.state.value,
        onChange: this.onEditableChange,
        onKeyDown: this.onKeyDown,
        onClick: this.onExit,
        onBlur: this.onBlur
      })
    )
  }
}
