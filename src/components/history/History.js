import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import pick from 'lodash/object/pick'
import {useSheet} from 'grape-web/lib/jss'

import InfiniteList from './InfiniteList'

import Row from './Row'
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
    onClickUser: PropTypes.func.isRequired,
    onUserScrollAfterScrollTo: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    channelId: PropTypes.number,
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
    customEmojis: {},
    onUserScrollAfterScrollTo: noop
  }

  componentWillReceiveProps(nextProps) {
    const {channelId, onLoad} = nextProps
    // 1. It is initial load, we had no channel id.
    // 2. New channel has been selected.
    if (channelId !== this.props.channelId) onLoad()
  }

  onRowsRendered = () => {
    // We need to unset the scrollTo once user has scrolled around, because he
    // might want to use jumper to jump again to the same scrollTo value.
    if (this.props.scrollTo) {
      this.props.onUserScrollAfterScrollTo()
    }
  }

  renderRow = (index) => {
    const {messages} = this.props

    return (
      <Row
        {...pick(this.props, 'user', 'onEdit', 'onRemove', 'onResend',
          'onGoToChannel', 'selectedMessageId')}
        message={messages[index]}
        prevMessage={messages[index - 1]} />
    )
  }

  render() {
    const {
      sheet, messages, user, scrollTo, minimumBatchSize,
      onTouchTopEdge, onLoadMore, onJump, channelId, onRead
    } = this.props
    const {classes} = sheet

    if (!user || !messages.length) return null

    return (
      <div className={classes.history}>
        <ReadMessageDispatcher
          messages={messages}
          channelId={channelId}
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
                  renderRow={this.renderRow} />
              )}
            </Jumper>
          )}
        </ReadMessageDispatcher>
      </div>
    )
  }
}
