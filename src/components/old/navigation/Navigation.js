import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import keyname from 'keyname'
import mousetrap from 'mousetrap'
import debounce from 'lodash/debounce'
import { findDOMNode } from 'react-dom'
import injectSheet from 'grape-web/lib/jss'
import { debouncingTime } from 'grape-web/lib/constants/time'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import Filter from './Filter'
import List from './List'
import FilteredList from './FilteredList'
import Channel from './Channel'
import Actions from './Actions'
import { styles } from './theme'

const messages = defineMessages({
  favorites: {
    id: 'favorites',
    defaultMessage: 'Favorites',
  },
  recent: {
    id: 'recent',
    defaultMessage: 'Recent',
  },
})

class Navigation extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    shortcuts: PropTypes.array,
    foundChannels: PropTypes.array.isRequired,
    searchingChannels: PropTypes.bool.isRequired,
    openPm: PropTypes.func.isRequired,
    onShowNewConversation: PropTypes.func.isRequired,
    openChannel: PropTypes.func.isRequired,
    loadOlderChannels: PropTypes.func.isRequired,
    searchChannelsForNavigation: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    colors: PropTypes.object,
    isLoading: PropTypes.bool,
    favorited: PropTypes.array.isRequired,
    recent: PropTypes.array.isRequired,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    shortcuts: ['mod+k'],
    colors: {},
    isLoading: false,
    permissions: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      bottomOffset: 5,
      step: 10,
      loaded: 50,
      shift: 20,
      filter: '',
    }

    mousetrap.bindGlobal(props.shortcuts, this.onShortcut)
  }

  componentWillReceiveProps(nextProps) {
    const { shift, filter, step } = this.state
    const { recent } = nextProps
    if (filter || recent.length < shift) return

    if (
      this.listsContainer.offsetHeight &&
      this.listsContainer.offsetHeight < this.navigation.offsetHeight
    ) {
      this.setState({
        shift: shift + step,
      })
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.foundChannels !== nextProps.foundChannels) {
      this.updateFocusedChannel(nextProps.foundChannels[0])
    }
  }

  onNavigationRef = ref => {
    this.navigation = ref
  }
  onListsContainerRef = ref => {
    this.listsContainer = ref
  }
  onFilterRef = ref => {
    // 'findDOMNode' needs here to not break keys binding.
    // It's not working without it.
    // eslint-disable-next-line react/no-find-dom-node
    this.filter = findDOMNode(ref)
  }
  onFilteredListRef = ref => {
    this.filteredList = ref
  }

  onShortcut = e => {
    e.preventDefault()
    this.filter.focus()
  }

  onScroll = e => {
    const { shift, loaded, bottomOffset, step } = this.state

    if (shift >= loaded) {
      this.setState({
        loaded: loaded + loaded,
      })

      this.props.loadOlderChannels()
      return
    }

    const { offsetHeight, scrollTop, scrollHeight } = e.target
    if (offsetHeight + scrollTop + bottomOffset >= scrollHeight) {
      this.setState({
        shift: shift + step,
      })
    }
  }

  onChangeFilterDebounced = debounce(value => {
    this.props.searchChannelsForNavigation(value)
  }, debouncingTime)

  onChangeFilter = ({ target }) => {
    const { value } = target
    this.setState({ filter: value })
    this.onChangeFilterDebounced(value)
  }

  onFocusFiltered = focusedChannel => {
    this.setState({
      focusedChannel,
    })
  }

  onKeyDown = e => {
    const keyName = keyname(e.keyCode)
    const { focusedChannel } = this.state

    if (keyName === 'esc' && !this.filter.value) {
      this.filter.blur()
    }
    if (!this.filteredList) return
    switch (keyName) {
      case 'up':
        this.filteredList.focus('prev')
        e.preventDefault()
        break
      case 'down':
        this.filteredList.focus('next')
        e.preventDefault()
        break
      case 'enter':
        if (focusedChannel) {
          this.goToChannel(focusedChannel)
        }
        e.preventDefault()
        break
      default:
    }
  }

  updateFocusedChannel(channel) {
    this.setState({
      focusedChannel: channel,
    })
  }

  goToChannel = channel => {
    this.setState({
      filter: '',
      filtered: [],
      focusedChannel: undefined,
    })

    const { id, type, partner } = channel
    const { openPm, openChannel } = this.props

    if (type === 'user') {
      openPm(id)
      return
    }

    if (type === 'pm') {
      openPm(partner.id)
      return
    }

    if (type === 'room') {
      openChannel(id)
    }
  }

  renderFilteredChannel = params => {
    const { item: channel, focused } = params
    const { classes } = this.props

    return (
      <Channel
        {...this.props}
        {...this.state}
        channel={channel}
        focused={focused}
        theme={{ classes }}
        key={channel.type + channel.id}
        onClick={() => this.goToChannel(channel)}
      />
    )
  }

  renderList() {
    const {
      classes,
      favorited,
      recent,
      foundChannels,
      intl: { formatMessage },
      searchingChannels,
    } = this.props
    const { shift, filter, focusedChannel } = this.state
    const recentList = recent.length > shift ? recent.slice(0, shift) : recent

    if (this.state.filter) {
      return (
        <FilteredList
          {...this.props}
          theme={{ classes }}
          filter={filter}
          ref={this.onFilteredListRef}
          focusedChannel={focusedChannel}
          searchingChannels={searchingChannels}
          foundChannels={foundChannels}
          renderItem={this.renderFilteredChannel}
          onSelect={this.goToChannel}
          onFocus={this.onFocusFiltered}
          onMouseOver={this.onFocusFiltered}
        />
      )
    }

    return (
      <div>
        <List
          {...this.props}
          {...this.state}
          title={formatMessage(messages.favorites)}
          type="favorites"
          theme={{ classes }}
          list={favorited}
          goToChannel={this.goToChannel}
        />
        <List
          {...this.props}
          {...this.state}
          title={formatMessage(messages.recent)}
          type="recent"
          theme={{ classes }}
          list={recentList}
          goToChannel={this.goToChannel}
        />
      </div>
    )
  }

  renderNavigation() {
    const {
      isLoading,
      classes,
      onShowNewConversation,
      permissions,
    } = this.props
    if (isLoading) return null
    // TODO since it's only one action (new conversation) we could inline the action directly here
    return (
      <div className={classes.navigationWrapper}>
        {!this.state.filter && (
          <Actions
            onNewConversation={onShowNewConversation}
            permissions={permissions}
          />
        )}
        {this.renderList()}
      </div>
    )
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.wrapper}>
        <div
          ref={this.onNavigationRef}
          onScroll={this.onScroll}
          className={classes.navigation}
        >
          <div ref={this.onListsContainerRef}>{this.renderNavigation()}</div>
        </div>
        <div className={classes.filter}>
          <Filter
            {...this.props}
            ref={this.onFilterRef}
            theme={{ classes }}
            value={this.state.filter}
            onKeyDown={this.onKeyDown}
            onChange={this.onChangeFilter}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(Navigation))
