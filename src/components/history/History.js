import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import get from 'lodash/object/get'
import {useSheet} from 'grape-web/lib/jss'

import InfiniteList from './InfiniteList'
import NoContent from './NoContent'
import ReadMessageDispatcher from './ReadMessageDispatcher'
import Jumper from './Jumper'
import {mergeMessages} from './utils'
import {styles} from './historyTheme'

function createState(props) {
  const {rows, map} = mergeMessages(props.messages, props)
  const scrollTo = map[props.scrollTo]
  return {rows, scrollTo}
}

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
    selectedMessageId: PropTypes.string,
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

  constructor(props) {
    super(props)
    this.state = createState(props)
  }

  componentWillReceiveProps(nextProps) {
    const {channel, onLoad, selectedMessageId, messages} = nextProps
    // 1. It is initial load, we had no channel id.
    // 2. New channel has been selected.
    // 3. Selected message has changed.
    const selectedMessageHasChanged = this.props.selectedMessageId !== selectedMessageId
    const channelHasChanged = get(channel, 'id') !== get(this.props, 'channel.id')

    if (selectedMessageHasChanged || channelHasChanged) {
      return onLoad()
    }

    if (messages !== this.props.messages) {
      this.setState(createState(nextProps))
    }
  }

  onRowsRendered = () => {
    // We need to unset the scrollTo once user has scrolled around, because he
    // might want to use jumper to jump again to the same scrollTo value.
    if (this.props.scrollTo) {
      this.props.onUserScrollAfterScrollTo()
    }
  }

  render() {
    const {
      sheet: {classes}, messages, user, minimumBatchSize, channel,
      onTouchTopEdge, onLoadMore, onJump, onInvite, onAddIntegration, onRead,
      noContent
    } = this.props
    const {rows, scrollTo} = this.state

    if (!user || !channel) return null

    if (!rows.length) {
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
                  rows={rows}
                  minimumBatchSize={minimumBatchSize}
                  onLoadMore={onLoadMore}
                  onTouchTopEdge={onTouchTopEdge}
                  renderNoContent={this.renderNoContent} />
              )}
            </Jumper>
          )}
        </ReadMessageDispatcher>
      </div>
    )
  }
}
