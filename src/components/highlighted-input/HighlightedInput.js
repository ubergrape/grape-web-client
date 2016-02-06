import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import noop from 'lodash/utility/noop'
import escape from 'lodash/string/escape'
import keyname from 'keyname'
import {useSheet} from 'grape-web/lib/jss'

import {
  getTouchedWord,
  getTokenPositionNearCaret,
  splitByTokens,
  ensureSpace,
  setCaretPosition
} from './utils'
import style from './style'

@useSheet(style)
export default class HighlightedInput extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    onChange: PropTypes.func,
    onResize: PropTypes.func,
    onKeyDown: PropTypes.func,
    getTokenClass: PropTypes.func,
    sheet: PropTypes.object.isRequired,
    Editable: PropTypes.func.isRequired,
    focused: PropTypes.bool,
    disabled: PropTypes.bool,
    theme: PropTypes.object,
    value: PropTypes.string,
    tokens: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    value: '',
    tokens: [],
    focused: true,
    disabled: false,
    theme: {},
    onChange: noop,
    onKeyDown: noop,
    onDidMount: noop,
    onResize: noop,
    getTokenClass: noop
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      caretAt: 0
    }
  }

  componentDidMount() {
    this.ensureContainerSize()
    this.props.onDidMount(this)
  }

  componentWillReceiveProps({value}) {
    if (value !== this.state.value) {
      this.setState({value, caretAt: value.length})
    }
  }

  componentDidUpdate() {
    this.ensureCaretPosition()
    this.ensureContainerSize()
  }

  onChange(e) {
    let change = e
    if (e.target) {
      change = {
        value: e.target.value,
        caretAt: e.target.selectionEnd
      }
    }

    this.setState(change, () => {
      this.props.onChange(change)
    })
  }

  onKeyDown(e) {
    this.props.onKeyDown(e)
    if (e.defaultPrevented) return

    const key = keyname(e.keyCode)

    switch (key) {
      case 'del':
      case 'backspace':
        if (this.removeToken(key === 'del' ? 'next' : 'prev')) {
          e.preventDefault()
        }
        break
      default:
    }
  }

  getTouchedWord() {
    const {value, selectionEnd: caretAt} = ReactDOM.findDOMNode(this.refs.editable)
    const word = getTouchedWord(value, caretAt)
    if (word) return word.value
  }

  /**
   * Insert a string at the caret position.
   * Ensure space before the string.
   */
  insert(str) {
    let {value, selectionEnd: caretAt} = ReactDOM.findDOMNode(this.refs.editable)
    let valueBefore = value.slice(0, caretAt)
    valueBefore = ensureSpace('after', valueBefore)
    const valueAfter = value.slice(caretAt, value.length)
    value = valueBefore + str + valueAfter
    caretAt = (valueBefore + str).length

    this.onChange({value, caretAt})
  }

  /**
   * Replace a token near the caret by a string.
   * Ensure space after the string.
   */
  replace(str) {
    let {value, selectionEnd: caretAt} = ReactDOM.findDOMNode(this.refs.editable)

    let valueBefore = ''
    let valueAfter = ''
    const token = getTouchedWord(value, caretAt)

    if (token) {
      valueBefore = value.slice(0, token.position[0])
      valueAfter = value.slice(token.position[1], value.length)
      if (valueAfter) valueAfter = ensureSpace('before', valueAfter)
    }

    value = valueBefore + str + valueAfter
    caretAt = (valueBefore + str).length

    this.onChange({value, caretAt})
  }

  // We can improve speed by using a fake caret in highlighter.
  // We can check if caret is inside/near the token.
  removeToken(direction) {
    const editable = ReactDOM.findDOMNode(this.refs.editable)

    const positionToDelete = getTokenPositionNearCaret(editable, direction, this.props.tokens)

    if (!positionToDelete) return false

    // Now we know that caret is inside of a token.
    const [start, end] = positionToDelete
    let {value} = editable
    value = `${value.slice(0, start)}${value.slice(end, value.length)}`
    this.onChange({value, caretAt: start})

    return true
  }

  splitByTokens() {
    return splitByTokens(this.state.value, this.props.tokens)
  }

  ensureCaretPosition() {
    if (!this.props.focused) return
    setCaretPosition(this.state.caretAt, ReactDOM.findDOMNode(this.refs.editable))
  }

  ensureContainerSize() {
    this.refs.wrapper.style.height = this.refs.highlighter.offsetHeight + 'px'

    // TODO Only call back if really resized.
    this.props.onResize()
  }

  renderHighlighterContent() {
    const {classes} = this.props.sheet
    const {tokens, getTokenClass} = this.props
    const {value} = this.state

    const content = splitByTokens(value, tokens).map((part, index) => {
      const isToken = tokens.indexOf(part) >= 0
      if (isToken) {
        // Render the highlighted token.
        return (
          <span
            key={index}
            className={`${classes.token} ${getTokenClass(part) || ''}`}>
            {part}
          </span>
        )
      }

      // Render pure text without highlighing
      // Used dangerouslySetInnerHTML to workaround a bug in IE11:
      // https://github.com/ubergrape/chatgrape/issues/3279
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{__html: escape(part)}}>
        </span>
      )
    })

    // Make highlighted height equal content height in editable,
    // because the last item is a space.
    content.push(' ')

    return content
  }

  render() {
    const {classes} = this.props.sheet
    const {Editable, theme} = this.props

    return (
      <div
        ref="wrapper"
        className={classes.wrapper}
        data-test="highlighted-editable">
        <div
          ref="highlighter"
          className={`${classes.highlighter} ${theme.editable}`}>
          {this.renderHighlighterContent()}
        </div>
        <Editable
          {...this.props}
          ref="editable"
          onKeyDown={::this.onKeyDown}
          onChange={::this.onChange}
          value={this.state.value}
          className={theme.editable} />
      </div>
    )
  }
}
