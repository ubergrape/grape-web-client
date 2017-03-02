import React, {PureComponent, PropTypes} from 'react'
import moment from 'moment'
import Spinner from 'grape-web/lib/spinner/Spinner'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  intlShape,
  injectIntl
} from 'react-intl'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import DateSeparator from '../../message-parts/DateSeparator'
import {ShowMore} from '../../i18n'
import style from './messageSearchStyles'
import Message from './Message'
import createGrapedownWithSearch from './createGrapedownWithSearch'
import Options from './Options'

@injectSheet(style)
@injectIntl
export default class MessageSearch extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    select: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    load: PropTypes.func.isRequired,
    searchOnlyInChannel: PropTypes.bool.isRequired,
    searchActivities: PropTypes.bool.isRequired,
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
    searchActivities: false,
    customEmojis: {},
    total: null,
    user: null
  }

  componentDidMount() {
    this.load()
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldLoad(nextProps)) {
      this.load(nextProps)
    }
  }

  onLoadMore = () => {
    this.load()
  }

  onSelect = (item) => {
    this.props.select(item)
  }

  onClose = () => {
    this.props.hide()
  }

  onClickOption = (e) => {
    const {query} = this.props
    // Don't close sidebar if click outside is in the options.
    if (!query || !query.length) e.stopPropagation()
  }

  shouldLoad({query, show, searchOnlyInChannel, searchActivities, showRoomMentions}) {
    switch (show) {
      case 'search':
        if (!query) return false
        if (query !== this.props.query) return true
        if (searchOnlyInChannel !== this.props.searchOnlyInChannel) return true
        if (searchActivities !== this.props.searchActivities) return true
        break
      case 'mentions':
        return showRoomMentions !== this.props.showRoomMentions
      default:
    }
    return false
  }

  load(props = this.props) {
    const {
      items, limit, query, searchOnlyInChannel, searchActivities, showRoomMentions
    } = props
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
        options = {searchOnlyInChannel, searchActivities}
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
      classes
    } = this.props

    return messages.reduce((elements, message, index) => {
      const prevMessage = messages[index - 1]

      // Render date separator.
      if (!prevMessage || !moment(message.time).isSame(prevMessage.time, 'day')) {
        elements.push(
          <DateSeparator
            theme={{date: classes.separatorDate}}
            date={message.time}
            key={`${message.id}-date`}
          />
        )
      }

      // Render channel name.
      if (!prevMessage || prevMessage.channel !== message.channel) {
        elements.push(
          <div className={classes.channel} key={`${message.id}-channel`}>
            {message.channel.name}
          </div>
        )
      }
      elements.push(this.renderMessage(message))

      return elements
    }, [])
  }

  renderMessage(message) {
    const {query, user, customEmojis, intl} = this.props
    const GrapedownWithSearch = createGrapedownWithSearch({
      query,
      user,
      intl,
      customEmojis
    })

    return (
      <Message message={message} key={message.id} onSelect={this.onSelect}>
        <GrapedownWithSearch text={message.text} />
      </Message>
    )
  }

  renderLoadMore() {
    const {total, items, classes} = this.props
    if (!total || items.length >= total) return null
    return (
      <div className={classes.loadMoreContainer}>
        <button
          onClick={this.onLoadMore}
          className={classes.button}
        >
          <ShowMore />
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes, total} = this.props
    if (total !== 0) return null
    return (
      <div className={classes.empty}>
        <FormattedMessage
          id="noMessagesFound"
          defaultMessage="No messages found"
        />
        .
      </div>
    )
  }

  render() {
    const {user, images, title, isLoading, classes} = this.props

    if (!user) return null

    return (
      <SidebarPanel
        title={title}
        images={images}
        options={
          <Options
            {...this.props}
            onClickOption={this.onClickOption}
            theme={{classes}}
          />
        }
        onClose={this.onClose}
      >
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
