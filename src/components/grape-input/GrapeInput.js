import React, {PropTypes, Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'

import Textarea from './Textarea'
import style from './grapeInputStyle'
import parseQuery from '../query/parse'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'
import HighlightedInput from '../highlighted-input/HighlightedInput'
import {create as createObject} from '../objects'

import {
  toMarkdown,
  fromMarkdown,
  getEmojiObjects
} from './utils'

@useSheet(style)
export default class GrapeInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onAbort: PropTypes.func,
    onEditPrevious: PropTypes.func,
    onDidMount: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    sheet: PropTypes.object.isRequired,
    // Prop `content` is a makrdown string.
    content: PropTypes.string
  }

  static defaultProps = {
    onSubmit: noop,
    onAbort: noop,
    onEditPrevious: noop,
    onDidMount: noop,
    onChange: noop,
    onKeyDown: noop,
    Editable: Textarea,
    content: ''
  }

  constructor(props) {
    super(props)
    const {content} = props
    const {objects, value} = fromMarkdown(content)
    this.state = {
      apiObjects: [],
      content,
      objects,
      value
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

  shouldComponentUpdate = shouldPureComponentUpdate

  onSubmit(e) {
    e.preventDefault()

    const {objects, content, apiObjects} = this.state
    const parts = this.input.splitByTokens().filter(part => part.trim())
    const tokens = parts.filter(token => objects[token])

    this.setState({
      content: '',
      value: '',
      objects: {},
      apiObjects: []
    }, () => {
      this.props.onSubmit({
        content,
        objects: apiObjects,
        objectsOnly: parts.length === tokens.length
      })
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
      default:
    }
  }

  onChange({value}) {
    const emojiObjects = getEmojiObjects(value)
    const objects = {...this.state.objects, ...emojiObjects}
    const content = toMarkdown(this.input.splitByTokens(), objects)

    this.setState({value, objects, content}, () => {
      const word = this.input.getTouchedWord()
      const query = parseQuery(word)
      this.props.onChange({query, content})
    })
  }

  /**
   * Returns a class name that will be applied to the token element for custom
   * styling.
   */
  getTokenClass(token) {
    const {tokenType} = this.state.objects[token]
    return this.props.sheet.classes[tokenType]
  }

  /**
   * Replace the query by a grape object.
   * Passed result is the original object from the api.
   */
  replace(result) {
    const object = createObject(result.type, result)
    const token = object.content
    const state = {
      objects: {
        ...this.state.objects,
        [token]: object
      },
      apiObjects: [...this.state.apiObjects, result]
    }
    this.setState(state, () => {
      this.input.replace(token)
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
          onChange={::this.onChange}
          onSubmit={::this.onSubmit} />
        <GlobalEvent event="resize" handler={::this.onResizeWindow} />
      </div>
    )
  }
}
