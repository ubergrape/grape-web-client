import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { shouldPureComponentUpdate } from 'react-pure-render'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'
import keyname from 'keyname'
import { create as createObject } from 'grape-web/lib/grape-objects'
import GlobalEvent from 'grape-web/lib/components/global-event'

import Textarea from './Textarea'
import style from './grapeInputStyle'
import parseQuery from '../query/parse'
import HighlightedInput from '../highlighted-input/HighlightedInput'

import { toMarkdown, fromMarkdown, getEmojiObjects } from './utils'

const messages = defineMessages({
  placeholder: {
    id: 'enterMessagePlaceholder',
    defaultMessage: 'Enter a message …',
  },
})

class GrapeInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onAbort: PropTypes.func,
    onEditPrevious: PropTypes.func,
    onDidMount: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    sheet: PropTypes.object.isRequired,
    // Prop `content` is a makrdown string.
    content: PropTypes.string,
    channel: PropTypes.object,
    Editable: PropTypes.any,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    onSubmit: noop,
    onAbort: noop,
    onEditPrevious: noop,
    onDidMount: noop,
    onChange: noop,
    onKeyDown: noop,
    Editable: Textarea,
    channel: {},
    content: '',
  }

  constructor(props) {
    super(props)
    const { content } = props
    const { objects, value } = fromMarkdown(content)
    this.state = {
      apiObjects: [],
      content,
      objects,
      value,
    }
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.channel.id !== this.props.channel.id &&
      // Can be undefined, and trigget typing event on initial loading,
      // because of undefined not equals real channel id.
      this.props.channel.id &&
      nextProps.channel.id
    ) {
      // When a user switches to another channel the input changes the content,
      // but the user actually didn't made any change to the input and therefor
      // an update even triggering typing should be avoided
      this.onChange({ value: nextProps.content, channelChanged: true })
    }
    if (nextProps.content !== this.state.content) {
      const { value, objects } = fromMarkdown(nextProps.content)
      this.setState({
        content: nextProps.content,
        value,
        objects: { ...this.state.objects, ...objects },
      })
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onSubmit = e => {
    e.preventDefault()

    const { objects, content, apiObjects } = this.state
    const parts = this.input.splitByTokens().filter(part => part.trim())
    const tokens = parts.filter(token => objects[token])

    this.setState(
      {
        content: '',
        value: '',
        objects: {},
        apiObjects: [],
      },
      () => {
        this.props.onSubmit({
          content,
          objects: apiObjects,
          objectsOnly:
            parts.length === tokens.length &&
            tokens.length === apiObjects.length,
        })
      },
    )
  }

  onResizeWindow = () => {
    if (this.state.value.trim()) {
      this.forceUpdate()
    }
  }

  onInputDidMount = ref => {
    this.input = ref
  }

  onKeyDown = e => {
    this.props.onKeyDown(e)
    if (e.defaultPrevented) return

    const key = keyname(e.keyCode)
    switch (key) {
      case 'esc':
        this.props.onAbort({ reason: key })
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

  onChange = ({ value, channelChanged = false }) => {
    const emojiObjects = getEmojiObjects(value)
    const objects = { ...this.state.objects, ...emojiObjects }
    const content = toMarkdown(this.input.splitByTokens(), objects)

    this.setState({ value, objects, content }, () => {
      const word = this.input.getTouchedWord()
      const query = parseQuery(word)
      this.props.onChange({ query, content, channelChanged })
    })
  }

  /**
   * Returns a class name that will be applied to the token element for custom
   * styling.
   */
  getTokenClass = token => {
    const { tokenType } = this.state.objects[token]
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
        [token]: object,
      },
      // Emojis are objects we want to highlight, but not apiObjects. Objects are highlighted
      // but storing an Emoji as API object could cause trouble when you only have one emoji
      // and it would be sent to the backend as media message instead of a text message.
      apiObjects:
        object.type === 'emoji'
          ? this.state.apiObjects
          : [...this.state.apiObjects, result],
    }
    this.setState(state, () => {
      this.input.replace(token)
    })
  }

  insert(str) {
    this.input.insert(str)
  }

  render() {
    const {
      sheet: { classes },
      intl: { formatMessage },
      ...rest
    } = this.props

    return (
      <div>
        <HighlightedInput
          {...rest}
          value={this.state.value}
          tokens={Object.keys(this.state.objects)}
          getTokenClass={this.getTokenClass}
          placeholder={formatMessage(messages.placeholder)}
          theme={classes}
          onDidMount={this.onInputDidMount}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
        />
        <GlobalEvent event="resize" handler={this.onResizeWindow} />
      </div>
    )
  }
}

export default injectSheet(style)(injectIntl(GrapeInput))
