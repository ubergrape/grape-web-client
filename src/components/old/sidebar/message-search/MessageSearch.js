import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import moment from 'moment'
import Spinner from 'grape-web/lib/components/spinner'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'

import DateSeparator from '../../message-parts/DateSeparator'
import { ShowMore } from '../../i18n'
import SidebarPanel from '../SidebarPanel'
import Options from '../Options'
import style from './messageSearchStyles'
import Message from '../Message'
import createGrapedownWithSearch from './createGrapedownWithSearch'

const shouldReplace = (props, options) =>
  Object.entries(options).some(([value, key]) => props[value] !== key)

class MessageSearch extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    colors: PropTypes.object,
    intl: intlShape.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onLoad: PropTypes.func.isRequired,
    currentChannelOnly: PropTypes.bool,
    searchActivities: PropTypes.bool,
    showRoomMentions: PropTypes.bool,
    showCurrentRoomMentions: PropTypes.bool,
    title: PropTypes.string.isRequired,
    images: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    query: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    isLoading: PropTypes.bool.isRequired,
    total: PropTypes.number,
    user: PropTypes.object,
    customEmojis: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
  }

  static defaultProps = {
    total: null,
    user: null,
    colors: {},
    currentChannelOnly: false,
    searchActivities: false,
    showRoomMentions: false,
    showCurrentRoomMentions: false,
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

  onSelect = item => {
    this.props.onSelect(item)
  }

  onClose = () => {
    this.props.onClose()
  }

  onClickOption = e => {
    const { query } = this.props
    // Don't close sidebar if click outside is in the options.
    if (!query || !query.length) e.stopPropagation()
  }

  shouldLoad({
    query,
    show,
    currentChannelOnly,
    showCurrentRoomMentions,
    searchActivities,
    showRoomMentions,
  }) {
    switch (show) {
      case 'search':
        if (!query) return false
        if (query !== this.props.query) return true
        if (currentChannelOnly !== this.props.currentChannelOnly) return true
        if (searchActivities !== this.props.searchActivities) return true
        break
      case 'mentions':
        if (showRoomMentions !== this.props.showRoomMentions) return true
        if (showCurrentRoomMentions !== this.props.showCurrentRoomMentions)
          return true
        break
      default:
    }
    return false
  }

  load(props = this.props) {
    const {
      items,
      limit,
      query,
      currentChannelOnly,
      searchActivities,
      showRoomMentions,
      showCurrentRoomMentions,
      onLoad,
    } = props
    if (!query || !query.length) return

    let options
    switch (props.show) {
      case 'mentions':
        options = {
          showRoomMentions,
          showCurrentRoomMentions,
          shouldReplace: shouldReplace(this.props, {
            showRoomMentions,
            showCurrentRoomMentions,
          }),
        }
        break
      case 'search':
        options = { currentChannelOnly, searchActivities }
        break
      default:
    }

    onLoad({
      // Is always the timestamp of the last loaded message.
      offsetDate: items.length ? items[items.length - 1].time : undefined,
      limit,
      query,
      options,
    })
  }

  renderMessages() {
    const { items: messages, classes } = this.props

    return messages.reduce((elements, message, index) => {
      const prevMessage = messages[index - 1]

      // Render date separator.
      if (
        !prevMessage ||
        !moment(message.time).isSame(prevMessage.time, 'day')
      ) {
        elements.push(
          <DateSeparator
            theme={{ date: classes.separatorDate }}
            date={message.time}
            key={`${message.id}-date`}
          />,
        )
      }

      // Render channel name.
      const { channel } = message
      if (!prevMessage || prevMessage.channel !== channel) {
        elements.push(
          <div className={classes.channel} key={`${message.id}-channel`}>
            {channel.type === 'room'
              ? channel.name
              : channel.partner.displayName}
          </div>,
        )
      }
      elements.push(this.renderMessage(message))

      return elements
    }, [])
  }

  renderMessage(message) {
    const { query, user, customEmojis, intl } = this.props
    const GrapedownWithSearch = createGrapedownWithSearch({
      query,
      user,
      intl,
      customEmojis,
    })

    return (
      <Message message={message} key={message.id} onSelect={this.onSelect}>
        <GrapedownWithSearch text={message.text} />
      </Message>
    )
  }

  renderLoadMore() {
    const { total, items, classes } = this.props
    if (!total || items.length >= total) return null
    return (
      <div className={classes.loadMoreContainer}>
        <button onClick={this.onLoadMore} className={classes.button}>
          <ShowMore />
        </button>
      </div>
    )
  }

  renderEmpty() {
    const { classes, total } = this.props
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
    const {
      user,
      colors,
      images,
      title,
      isLoading,
      classes,
      options,
    } = this.props

    if (!user) return null

    return (
      <SidebarPanel
        title={title}
        colors={colors}
        images={images}
        options={
          <Options
            options={options}
            isLoading={isLoading}
            onClickOption={this.onClickOption}
          />
        }
        onClose={this.onClose}
      >
        <div className={classes.messageSearch}>
          {this.renderMessages()}
          {this.renderLoadMore()}
          {this.renderEmpty()}
          {isLoading && <Spinner className={classes.spinner} />}
        </div>
      </SidebarPanel>
    )
  }
}

export default injectSheet(style)(injectIntl(MessageSearch))
