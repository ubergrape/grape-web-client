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
    const {value} = props
    this.state = {
      value,
      caretAt: value.length
    }
  }

  componentDidMount() {
    this.editable = ReactDOM.findDOMNode(this.refs.editable)
    this.ensureContainerSize()
    this.props.onDidMount(this)
  }

  componentWillReceiveProps({value}) {
    if (value !== this.state.value) {
      this.setState({value, caretAt: value.length})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.ensureCaretPosition()
    this.ensureContainerSize()
    if (prevState.value !== this.state.value) {
      this.props.onChange(this.state)
    }
  }

  onChange({target}) {
    this.setState({
      value: target.value,
      caretAt: target.selectionEnd
    })
  }

  onKeyDown(e) {
    this.props.onKeyDown(e)
    if (e.defaultPrevented) return

    const key = keyname(e.keyCode)
    let removed = false
    if (key === 'del') removed = this.removeTokenIfTouched('next')
    if (key === 'backspace') removed = this.removeTokenIfTouched('prev')
    if (removed) e.preventDefault()
  }

  /**
   * Get the word caret is close by.
   */
  getTouchedWord() {
    const {value, caretAt} = this.state
    const word = getTouchedWord(value, caretAt)
    if (word) return word.value
  }

  /**
   * Insert a string at the caret position.
   * Ensure space before the string.
   */
  insert(str) {
    let {value, selectionEnd: caretAt} = this.editable
    let valueBefore = value.slice(0, caretAt)
    valueBefore = ensureSpace('after', valueBefore)

    let valueAfter = value.slice(caretAt, value.length)
    if (valueAfter) valueAfter = ensureSpace('before', valueAfter)
    value = valueBefore + str + valueAfter
    caretAt = (valueBefore + str).length

    this.setState({value, caretAt})
  }

  /**
   * Replace a word near the caret by a string.
   * Ensure space after the string.
   */
  replace(str) {
    let {value, selectionEnd: caretAt} = this.editable

    const word = getTouchedWord(value, caretAt)

    if (!word) return

    const valueBefore = value.slice(0, word.position[0])
    let valueAfter = value.slice(word.position[1], value.length)
    valueAfter = ensureSpace('before', valueAfter)

    value = valueBefore + str + valueAfter
    caretAt = (valueBefore + str).length + 1

    this.setState({value, caretAt})
  }

  /**
   * Remove a token completely by one key press.
   * Direction indicates where the word is positioned relatively to the caret.
   *
   * We can improve the speed by using a fake caret in highlighter.
   * We can check if caret is inside/near the token.
   */
  removeTokenIfTouched(direction) {
    const {editable} = this

    const positionToDelete = getTokenPositionNearCaret(editable, direction, this.props.tokens)

    if (!positionToDelete) return false

    // Now we know that caret is inside of a token.
    const [start, end] = positionToDelete
    let {value} = editable
    value = `${value.slice(0, start)}${value.slice(end, value.length)}`
    this.setState({value, caretAt: start})

    return true
  }

  /**
   * Split the value into an array of words and tokens as they appear in text.
   */
  splitByTokens() {
    return splitByTokens(this.state.value, this.props.tokens)
  }

  ensureCaretPosition() {
    if (!this.props.focused) return
    setCaretPosition(this.state.caretAt, this.editable)
  }

  ensureContainerSize() {
    const highlighterHeight = this.refs.highlighter.offsetHeight
    const {container} = this.refs
    const containerHeight = container.offsetHeight

    if (containerHeight !== highlighterHeight) {
      container.style.height = `${highlighterHeight}px`
      this.props.onResize()
    }
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
        ref="container"
        className={`${classes.container} ${theme.container}`}
        data-test="highlighted-editable">
        <div
          ref="highlighter"
          className={`${classes.highlighter} ${theme.highlighter}`}>
          {this.renderHighlighterContent()}
        </div>
        <Editable
          {...this.props}
          ref="editable"
          onKeyDown={::this.onKeyDown}
          onChange={::this.onChange}
          value={this.state.value}
          className={`${classes.editable} ${theme.editable}`} />
      </div>
    )
  }
}
