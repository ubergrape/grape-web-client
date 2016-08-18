import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import pick from 'lodash/object/pick'
import get from 'lodash/object/get'

import {useSheet} from 'grape-web/lib/jss'

import InfiniteList from './InfiniteList'

import Row from './Row'
import NoContent from './NoContent'
import ReadMessageDispatcher from './ReadMessageDispatcher'
import Jumper from './Jumper'
import {styles} from './historyTheme'

@useSheet(styles)
export default class History extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired,
    onGoToChannel: PropTypes.func.isRequired,
    onUserScrollAfterScrollTo: PropTypes.func.isRequired,
    onInvite: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    noContent: PropTypes.bool.isRequired,
    channel: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    messages: PropTypes.array,
    user: PropTypes.object,
    // Will scroll to a message by id.
    scrollTo: PropTypes.string,
    minimumBatchSize: PropTypes.number
  }

  static defaultProps = {
    messages: [],
    onLoad: noop,
    onLoadMore: noop,
    onJump: noop,
    onRead: noop,
    onClickUser: noop,
    onTouchTopEdge: noop,
    onUserScrollAfterScrollTo: noop,
    onInvite: noop,
    onAddIntegration: noop,
    customEmojis: {},
    noContent: false
  }

  componentWillReceiveProps(nextProps) {
    const {channel, onLoad} = nextProps
    // 1. It is initial load, we had no channel id.
    // 2. New channel has been selected.

    if (get(channel, 'id') !== get(this.props, 'channel.id')) {
      onLoad()
    }
  }

  onRowsRendered = () => {
    // We need to unset the scrollTo once user has scrolled around, because he
    // might want to use jumper to jump again to the same scrollTo value.
    if (this.props.scrollTo) {
      this.props.onUserScrollAfterScrollTo()
    }
  }

  getRowProps = (index) => {
    const {messages} = this.props
    return {
      message: messages[index],
      prevMessage: messages[index - 1],
      isLast: index === messages.length - 1,
      ...pick(this.props, 'user', 'customEmojis', 'onEdit', 'onRemove', 'onResend',
        'onGoToChannel', 'selectedMessageId')
    }
  }

  renderRow = (index) => (
    <Row {...this.getRowProps(index)} />
  )

  render() {
    const {
      sheet, messages, user, scrollTo, minimumBatchSize, channel,
      onTouchTopEdge, onLoadMore, onJump, onInvite, onAddIntegration, onRead,
      noContent
    } = this.props
    const {classes} = sheet

    if (!user || !channel) return null

    if (!messages.length) {
      if (noContent) {
        return (
          <NoContent
            channel={channel}
            onInvite={onInvite}
            onAddIntegration={onAddIntegration} />
        )
      }

      return null
    }

    return (
      <div className={classes.history}>
        <ReadMessageDispatcher
          messages={messages}
          channelId={channel.id}
          onRead={onRead}>
          {({onRowsRendered: onRowsRenderedInReadMessageDispatcher}) => (
            <Jumper onJump={onJump}>
              {({onRowsRendered: onRowsRenderedInJumper}) => (
                <InfiniteList
                  onRowsRendered={(params) => {
                    onRowsRenderedInJumper(params)
                    onRowsRenderedInReadMessageDispatcher(params)
                    this.onRowsRendered(params)
                  }}
                  scrollTo={scrollTo}
                  messages={messages}
                  minimumBatchSize={minimumBatchSize}
                  onLoadMore={onLoadMore}
                  onTouchTopEdge={onTouchTopEdge}
                  renderRow={this.renderRow}
                  renderNoContent={this.renderNoContent}
                  getRowProps={this.getRowProps} />
              )}
            </Jumper>
          )}
        </ReadMessageDispatcher>
      </div>
    )
  }
}
