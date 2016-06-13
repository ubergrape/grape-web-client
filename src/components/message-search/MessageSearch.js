import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import moment from 'moment'
import findMatches from 'grape-web/lib/search/findMatches'
import Spinner from 'grape-web/lib/spinner/Spinner'
import {useSheet} from 'grape-web/lib/jss'

import style from './messageSearchStyles'
import Message from './Message'
import Options from './Options'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import DateSeparator from '../message-parts/DateSeparator'

@useSheet(style)
export default class MessageSearch extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    searchOnlyInChannel: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    images: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    total: PropTypes.number,
    query: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    query: '',
    options: []
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldLoad(nextProps)) {
      this.load(nextProps)
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onLoadMore() {
    this.load()
  }

  onSelect(item) {
    this.props.select(item)
  }

  onClose() {
    this.props.hide()
  }

  onClickOption = e => {
    const {query} = this.props
    // Don't close sidebar if click outside is in the options.
    if (!query || !query.length) e.stopPropagation()
  }

  shouldLoad(props) {
    if (!props.query) return false
    if (props.query !== this.props.query) return true
    if (props.searchOnlyInChannel !== this.props.searchOnlyInChannel) return true
  }

  load(props = this.props) {
    const {items, limit, query, searchOnlyInChannel} = props
    if (!query || !query.length) return
    props.load({
      // Is always the timestamp of the last loaded message.
      offsetDate: items.length ? items[items.length - 1].time : undefined,
      limit,
      query,
      searchOnlyInChannel
    })
  }

  renderMessages() {
    const {classes} = this.props.sheet
    const {query, items} = this.props

    const messages = items.map(item => {
      let {content} = item
      const matches = findMatches(content, query)

      if (matches.length) {
        content = matches.map((match, key) => {
          return (
            <span
              key={key}
              className={match.found ? classes.highlighted : null}>
              {match.text}
            </span>
          )
        })
      }

      return {...item, content}
    })

    return messages.reduce((elements, message, index) => {
      const prevMessage = messages[index - 1]

      // Render date separator.
      if (!prevMessage || !moment(message.time).isSame(prevMessage.time, 'day')) {
        elements.push(
          <DateSeparator
            theme={{date: classes.separatorDate}}
            date={message.time}
            key={message.time + index} />
        )
      }

      // Render channel name.
      if (!prevMessage || prevMessage.channel !== message.channel) {
        elements.push(
          <div className={classes.channel} key={message.channel + index}>
            {message.channel}
          </div>
        )
      }
      elements.push(this.renderMessage(message))

      return elements
    }, [])
  }

  renderMessage(message) {
    const {classes} = this.props.sheet
    return (
      <div
        className={classes.message}
        onClick={this.onSelect.bind(this, message)}
        key={message.id}>
        <Message {...message}>{message.content}</Message>
      </div>
    )
  }

  renderLoadMore() {
    const {total, items} = this.props
    if (!total || items.length >= total) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.loadMoreContainer}>
        <button
          onClick={::this.onLoadMore}
          className={classes.button}>
          Show more
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes} = this.props.sheet
    if (this.props.total !== 0) return null
    return (
      <div className={classes.empty}>
        No messages found.
      </div>
    )
  }

  render() {
    const {images, title, isLoading, sheet} = this.props
    const {classes} = sheet
    return (
      <SidebarPanel
        title={title}
        images={images}
        options={
          <Options
            {...this.props}
            onClickOption={this.onClickOption}
            theme={{classes}} />
        }
        onClose={::this.onClose}>
        <div className={classes.messageSearch}>
          {this.renderMessages()}
          {this.renderLoadMore()}
          {this.renderEmpty()}
          {isLoading && <Spinner image={images.spinner} />}
        </div>
      </SidebarPanel>
    )
  }
}
