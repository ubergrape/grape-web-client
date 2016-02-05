import React, {PropTypes, Component} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'

import GlobalEvent from '../global-event/GlobalEvent'
import HighlightedInput from '../highlighted-input/HighlightedInput'
import Textarea from './Textarea'
import style from './grapeInputStyle'

// TODO move utils
import {
  toMarkdown,
  fromMarkdown,
  getEmojiObjects,
  getQuery,
  tokenize
} from '../highlighted-input/utils'

@useSheet(style)
export default class GrapeInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onAbort: PropTypes.func,
    onEditPrevious: PropTypes.func,
    onDidMount: PropTypes.func,
    onChange: PropTypes.func,
    sheet: PropTypes.object.isRequired,
    content: PropTypes.string
  }

  static defaultProps = {
    onSubmit: noop,
    onAbort: noop,
    onEditPrevious: noop,
    onDidMount: noop,
    onChange: noop,
    Editable: Textarea,
    content: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      content: props.content,
      ...fromMarkdown(props.content)
    }
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.state.content) {
      const {value, objects} = fromMarkdown(nextProps.content)
      this.setState({
        content: nextProps.content,
        value,
        objects: {...this.state.objects, ...objects}
      })
    }
  }

  onEnter(e) {
    e.preventDefault()

    // TODO Don't access state directly.
    const {value, objects, content} = this.state
    const tokens = Object.keys(objects)
    const hasText = tokenize(value, tokens).some(token => {
      if (!token.trim()) return false
      return tokens.indexOf(token) === -1
    })

    this.props.onSubmit({
      content,
      // TODO We need to pass over api objects, maybe in the parent component.
      objects,
      objectsOnly: !hasText
    })
  }

  onResizeWindow() {
    if (this.state.value.trim()) {
      this.forceUpdate()
    }
  }

  onInputDidMount(ref) {
    this.input = ref
  }

  onKeyDown(e) {
    this.props.onKeyDown(e)
    if (e.defaultPrevented) return

    const key = keyname(e.keyCode)
    switch (key) {
      case 'esc':
        this.props.onAbort({reason: key})
        e.preventDefault()
        break
      case 'up':
        if (!this.state.value) {
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

  onChange({value, caretAt}) {
    const emojiObjects = getEmojiObjects(value)
    const objects = {...this.state.objects, ...emojiObjects}
    const content = toMarkdown(value, objects)

    this.setState({value, objects, content}, () => {
      this.props.onChange({
        query: getQuery(value, caretAt),
        content
      })
    })
  }

  getTokenClass(token) {
    const {tokenType} = this.state.objects[token]
    return this.props.sheet.classes[tokenType]
  }

  replaceToken(object) {
    const {objects} = this.state
    const token = object.content
    const state = {
      objects: {
        ...objects,
        [token]: object
      }
    }
    this.setState(state, () => {
      // For the convenience, we insert always a space after insertion.
      this.input.replaceToken(token + ' ')
    })
  }

  insert(str) {
    this.input.insert(str)
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div>
        <HighlightedInput
          {...this.props}
          value={this.state.value}
          tokens={Object.keys(this.state.objects)}
          getTokenClass={::this.getTokenClass}
          theme={classes}
          onDidMount={::this.onInputDidMount}
          onKeyDown={::this.onKeyDown}
          onChange={::this.onChange} />
        <GlobalEvent event="resize" handler={::this.onResizeWindow} />
      </div>
    )
  }
}
