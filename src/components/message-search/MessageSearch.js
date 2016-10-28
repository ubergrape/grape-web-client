import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import moment from 'moment'
import Spinner from 'grape-web/lib/spinner/Spinner'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  intlShape,
  injectIntl
} from 'react-intl'

import style from './messageSearchStyles'
import Message from './Message'
import createGrapedownWithSearch from './createGrapedownWithSearch'
import Options from './Options'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import DateSeparator from '../message-parts/DateSeparator'
import {ShowMore} from '../i18n/i18n'

@injectSheet(style)
@injectIntl
export default class MessageSearch extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    select: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    searchOnlyInChannel: PropTypes.bool.isRequired,
    showRoomMentions: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    images: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    query: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    isLoading: PropTypes.bool.isRequired,
    total: PropTypes.number,
    user: PropTypes.object,
    customEmojis: PropTypes.object.isRequired
  }

  static defaultProps = {
    query: '',
    options: [],
    showRoomMentions: false,
    searchOnlyInChannel: false,
    customEmojis: {}
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldLoad(nextProps)) {
      this.load(nextProps)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onLoadMore = () => {
    this.load()
  }

  onSelect(item) {
    this.props.select(item)
  }

  onClose = () => {
    this.props.hide()
  }

  onClickOption = e => {
    const {query} = this.props
    // Don't close sidebar if click outside is in the options.
    if (!query || !query.length) e.stopPropagation()
  }

  shouldLoad({query, show, searchOnlyInChannel, showRoomMentions}) {
    switch (show) {
      case 'search':
        if (!query) return false
        if (query !== this.props.query) return true
        if (searchOnlyInChannel !== this.props.searchOnlyInChannel) return true
        break
      case 'mentions':
        if (showRoomMentions !== this.props.showRoomMentions) return true
        break
      default:
    }
  }

  load(props = this.props) {
    const {items, limit, query, searchOnlyInChannel, showRoomMentions} = props
    if (!query || !query.length) return

    let options
    switch (props.show) {
      case 'mentions':
        options = {
          showRoomMentions,
          shouldReplace: showRoomMentions !== this.props.showRoomMentions
        }
        break
      case 'search':
        options = {searchOnlyInChannel}
        break
      default:
    }

    props.load({
      // Is always the timestamp of the last loaded message.
      offsetDate: items.length ? items[items.length - 1].time : undefined,
      limit,
      query,
      options
    })
  }

  renderMessages() {
    const {
      items: messages,
      sheet: {classes}
    } = this.props

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
            {message.channel.name}
          </div>
        )
      }
      elements.push(this.renderMessage(message))

      return elements
    }, [])
  }

  renderMessage(message) {
    const {query, sheet: {classes}, user, customEmojis, intl} = this.props
    const GrapedownWithSearch = createGrapedownWithSearch({
      query,
      user,
      intl,
      customEmojis
    })

    return (
      <div
        className={classes.message}
        onClick={this.onSelect.bind(this, message)}
        key={message.id}>
        <Message {...message}>
          <GrapedownWithSearch text={message.text} />
        </Message>
      </div>
    )
  }

  renderLoadMore() {
    const {total, items, sheet: {classes}} = this.props
    if (!total || items.length >= total) return null
    return (
      <div className={classes.loadMoreContainer}>
        <button
          onClick={this.onLoadMore}
          className={classes.button}>
          <ShowMore />
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes} = this.props.sheet
    if (this.props.total !== 0) return null
    return (
      <div className={classes.empty}>
        <FormattedMessage
          id="noMessagesFound"
          defaultMessage="No messages found" />
        .
      </div>
    )
  }

  render() {
    const {user, images, title, isLoading, sheet: {classes}} = this.props

    if (!user) return null

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
        onClose={this.onClose}>
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
