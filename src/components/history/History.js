import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import get from 'lodash/object/get'
import injectSheet from 'grape-web/lib/jss'

import InfiniteList from './InfiniteList'
import NoContent from './NoContent'
import ReadRow from './ReadRow'
import Jumper from './Jumper'
import Row from './Row'
import {createRowsState} from './utils'
import {styles} from './historyTheme'

function createState(state, props) {
  const {rows, map} = createRowsState(state.rows, props.messages, props)
  const scrollTo = map[props.scrollTo]
  return {rows, scrollTo}
}

@injectSheet(styles)
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
    this.state = createState({}, props)
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
      this.setState(createState(this.state, nextProps))
    }
  }

  onRowsRendered = () => {
    // We need to unset the scrollTo once user has scrolled around, because he
    // might want to use jumper to jump again to the same scrollTo value.
    if (this.props.scrollTo) {
      this.props.onUserScrollAfterScrollTo()
    }
  }

  onToggleExpander = ({id, isExpanded}) => {
    const rows = this.state.rows.map(row => {
      if (row.id !== id) return row
      return {...row, isExpanded}
    })
    this.setState({rows})
  }

  renderRow = ({index}) => (
    <Row
      {...this.state.rows[index]}
      onToggleExpander={this.onToggleExpander} />
  )

  render() {
    const {
      sheet: {classes}, user, minimumBatchSize, channel, noContent,
      onTouchTopEdge, onLoadMore, onJump, onInvite, onAddIntegration, onRead
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
        <ReadRow
          rows={rows}
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
                  onToggleExpander={this.onToggleExpander}
                  renderNoContent={this.renderNoContent}
                  renderRow={this.renderRow} />
              )}
            </Jumper>
          )}
        </ReadRow>
      </div>
    )
  }
}
