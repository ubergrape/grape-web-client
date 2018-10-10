import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import injectSheet from 'grape-web/lib/jss'

import InfiniteList from './InfiniteList'
import NoContent from './NoContent'
import NoChannels from './NoChannels'
import ReadRow from './ReadRow'
import Jumper from './Jumper'
import Row from './Row'
import { createRowsState } from './utils'
import LoadingText from './LoadingText'

function createState(state, props) {
  const { rows, map } = createRowsState(state.rows, props.messages, props)
  return {
    rows,
    scrollTo: map[props.scrollTo],
  }
}

const styles = {
  history: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}

class History extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired,
    onUserScrollAfterScrollTo: PropTypes.func.isRequired,
    onInvite: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    onNewConversation: PropTypes.func.isRequired,
    showNoContent: PropTypes.bool,
    channel: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    users: PropTypes.array,
    messages: PropTypes.array,
    user: PropTypes.object,
    selectedMessageId: PropTypes.string,
    selectedMessageIdTimestamp: PropTypes.number,
    // Will scroll to a message by id.
    scrollTo: PropTypes.string,
    scrollToAlignment: PropTypes.string,
    minimumBatchSize: PropTypes.number,
    isLoading: PropTypes.bool,
    loadedNewerMessage: PropTypes.bool.isRequired,
    isMemberOfAnyRooms: PropTypes.bool.isRequired,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    messages: [],
    showNoContent: false,
    isLoading: false,
    user: null,
    channel: null,
    users: [],
    selectedMessageId: null,
    selectedMessageIdTimestamp: null,
    scrollTo: null,
    scrollToAlignment: null,
    minimumBatchSize: null,
    permissions: {},
  }

  constructor(props) {
    super(props)
    this.state = createState({}, props)
    this.needsInitialLoad = true
  }

  componentDidMount() {
    this.load()
  }

  componentWillReceiveProps(nextProps) {
    const { channel, selectedMessageId, messages, isLoading } = nextProps
    // 1. It is initial load, we had no channel id.
    // 2. New channel has been selected.
    // 3. Selected message has changed.
    // 4. The same selected message has been clicked on again
    const selectedMessageHasChanged =
      this.props.selectedMessageId !== selectedMessageId
    const selectedMessageHasBeenClickedOnAgain =
      this.props.selectedMessageId &&
      this.props.selectedMessageIdTimestamp !==
        nextProps.selectedMessageIdTimestamp
    const channelHasChanged =
      get(channel, 'id') !== get(this.props, 'channel.id')
    if (
      channelHasChanged ||
      selectedMessageHasChanged ||
      selectedMessageHasBeenClickedOnAgain ||
      isLoading
    ) {
      this.needsInitialLoad = true
    }

    if (!isEqual(messages, this.props.messages)) {
      this.setState(createState(this.state, nextProps))
    }
    if (this.props.scrollTo !== nextProps.scrollTo) {
      this.setState({ scrollTo: nextProps.scrollTo })
    }
  }

  componentDidUpdate() {
    this.load()
  }

  onRowsRendered = () => {
    // We need to unset the scrollTo once user has scrolled around, because he
    // might want to use jumper to jump again to the same scrollTo value.
    if (this.props.scrollTo) {
      this.props.onUserScrollAfterScrollTo()
    }
  }

  onToggleExpander = ({ id, isExpanded }) => {
    const rows = this.state.rows.map(row => {
      if (row.id !== id) return row
      return { ...row, isExpanded }
    })
    this.setState({ rows })
  }

  load() {
    const { isLoading, channel, onLoad, isMemberOfAnyRooms } = this.props
    if (this.needsInitialLoad && !isLoading && channel && isMemberOfAnyRooms) {
      this.needsInitialLoad = false
      onLoad()
    }
  }

  renderRow = ({ index, key, style }) => (
    <Row
      {...this.state.rows[index]}
      key={key}
      style={style}
      onToggleExpander={this.onToggleExpander}
    />
  )

  render() {
    const {
      sheet: { classes },
      user,
      minimumBatchSize,
      channel,
      users,
      showNoContent,
      onTouchTopEdge,
      onLoadMore,
      onJump,
      onInvite,
      onAddIntegration,
      onRead,
      isLoading,
      selectedMessageId,
      scrollToAlignment,
      loadedNewerMessage,
      isMemberOfAnyRooms,
      onNewConversation,
      permissions,
    } = this.props
    const { rows, scrollTo } = this.state

    if (isLoading) return <LoadingText />

    if (!isMemberOfAnyRooms) {
      return <NoChannels onNewConversation={onNewConversation} />
    }

    if (!user || !channel) return null

    // When we switch between channels, we rerender history with empty rows
    // in order to respond immediately to users action with empty screen and
    // show messages later.
    if (!rows.length) {
      if (showNoContent) {
        return (
          <NoContent
            channel={channel}
            users={users}
            onInvite={onInvite}
            permissions={permissions}
            onAddIntegration={onAddIntegration}
          />
        )
      }

      return null
    }

    return (
      <div className={classes.history}>
        <ReadRow
          rows={rows}
          channelId={channel.id}
          onRead={onRead}
          selectedMessageId={selectedMessageId}
        >
          {({ onRowsRendered: onRowsRenderedInReadMessageDispatcher }) => (
            <Jumper onJump={onJump}>
              {({ onScroll }) => (
                <InfiniteList
                  onRowsRendered={params => {
                    onRowsRenderedInReadMessageDispatcher(params)
                    this.onRowsRendered(params)
                  }}
                  onScroll={onScroll}
                  scrollTo={scrollTo}
                  scrollToAlignment={scrollToAlignment}
                  rows={rows}
                  minimumBatchSize={minimumBatchSize}
                  onLoadMore={onLoadMore}
                  onTouchTopEdge={onTouchTopEdge}
                  onToggleExpander={this.onToggleExpander}
                  renderNoContent={this.renderNoContent}
                  renderRow={this.renderRow}
                  loadedNewerMessage={loadedNewerMessage}
                />
              )}
            </Jumper>
          )}
        </ReadRow>
      </div>
    )
  }
}

export default injectSheet(styles)(History)
