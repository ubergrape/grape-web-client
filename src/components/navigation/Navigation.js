import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import Fuse from 'fuse.js'
import keyname from 'keyname'
import mousetrap from 'mousetrap'
import injectSheet from 'grape-web/lib/jss'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Filter from './Filter'
import List from './List'
import FilteredList from './FilteredList'
import Channel from './Channel'
import ManageButtons from './ManageButtons'
import {styles} from './theme'

const messages = defineMessages({
  channelHeader: {
    id: 'noConversationYet',
    defaultMessage: 'No conversation yet'
  },
  favorites: {
    id: 'favorites',
    defaultMessage: 'Favorites'
  },
  recent: {
    id: 'recent',
    defaultMessage: 'Recent'
  }
})

@injectSheet(styles)
@injectIntl
export default class Navigation extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    shortcuts: PropTypes.array.isRequired,
    goToChannel: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    joined: PropTypes.array.isRequired,
    unjoined: PropTypes.array.isRequired, // eslint-disable-line react/no-unused-prop-types
    favorited: PropTypes.array.isRequired,
    recent: PropTypes.array.isRequired,
    step: PropTypes.number.isRequired,
    bottomOffset: PropTypes.number.isRequired
  }

  static defaultProps = {
    step: 10,
    bottomOffset: 5,
    shortcuts: ['mod+k'],
    isLoading: false
  }

  constructor(props) {
    super(props)
    this.state = {
      shift: 20,
      filter: '',
      filtered: [],
      filteredUnJoined: []
    }
    this.filter = null
    this.filteredList = null
    this.listsContainer = null
    this.navigation = null

    mousetrap.bindGlobal(props.shortcuts, this.onShortcut)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.joined !== this.props.joined) {
      this.setState({
        fuseJoined: new Fuse(
          nextProps.joined,
          {keys: ['name'], threshold: 0.3}
        ),
        fuseUnJoined: new Fuse(
          nextProps.unjoined,
          {keys: ['name'], threshold: 0.3}
        )
      })
    }

    const {shift, filter} = this.state
    const {recent, step} = nextProps
    if (filter || recent.length < shift) return

    if (
      this.listsContainer &&
      this.listsContainer.offsetHeight &&
      this.listsContainer.offsetHeight < this.navigation.offsetHeight
    ) {
      this.setState({
        shift: shift + step
      })
    }
  }

  onNavigationRef = (ref) => { this.navigation = ref }
  onListsContainerRef = (ref) => { this.listsContainer = ref }
  onFilterRef = (ref) => { this.filter = findDOMNode(ref) }
  onFilteredListRef = (ref) => { this.filteredList = ref }

  onShortcut = (e) => {
    e.preventDefault()
    this.filter.focus()
  }

  onScroll = (e) => {
    const {recent, bottomOffset} = this.props
    if (this.state.shift >= recent.length) return

    const {offsetHeight, scrollTop, scrollHeight} = e.target
    if (offsetHeight + scrollTop + bottomOffset >= scrollHeight) {
      this.setState({
        shift: this.state.shift + this.props.step
      })
    }
  }

  onSelectFiltered = (channel) => {
    this.goToChannel(channel)
  }

  onChangeFilter = ({target}) => {
    const {value} = target
    const filtered = this.state.fuseJoined.search(value)
    const filteredUnJoined = this.state.fuseUnJoined.search(value)

    this.setState({
      filtered,
      filteredUnJoined,
      filter: value,
      focusedChannel: filtered.concat(filteredUnJoined)[0]
    })
  }

  onFocusFiltered = (channel) => {
    this.setState({focusedChannel: channel})
  }

  onKeyDownFilter = (e) => {
    const keyName = keyname(e.keyCode)

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
        this.onSelectFiltered(this.state.focusedChannel)
        e.preventDefault()
        break
      default:
    }
  }

  goToChannel = (channel) => {
    if (this.props.channel.id === channel.id) return

    this.props.goToChannel(channel.slug || channel.mate.slug)
    this.setState({
      filter: '',
      filtered: [],
      focusedChannel: null
    })
  }

  renderFilteredChannel = (params) => {
    const {item: channel, focused} = params
    const {classes} = this.props.sheet
    const {formatMessage} = this.props.intl
    const isFirstInUnJoined = channel === this.state.filteredUnJoined[0]

    return (
      <Channel
        {...this.props}
        {...this.state}
        header={isFirstInUnJoined ? formatMessage(messages.channelHeader) : ''}
        channel={channel}
        focused={focused}
        theme={{classes}}
        onClick={() => this.goToChannel(channel)}
      />
    )
  }

  renderList() {
    const {classes} = this.props.sheet

    if (this.state.filter) {
      return (
        <FilteredList
          {...this.props}
          {...this.state}
          theme={{classes}}
          ref={this.onFilteredListRef}
          renderItem={this.renderFilteredChannel}
          onSelect={this.onSelectFiltered}
          onFocus={this.onFocusFiltered}
          onMouseOver={this.onFocusFiltered}
        />
      )
    }

    const {recent, intl} = this.props
    const {formatMessage} = intl
    const {shift} = this.state
    const recentList = recent.length > shift ? recent.slice(0, shift) : recent

    return (
      <div>
        <List
          {...this.props}
          {...this.state}
          title={formatMessage(messages.favorites)}
          type="favorites"
          theme={{classes}}
          list={this.props.favorited}
          goToChannel={this.goToChannel}
        />
        <List
          {...this.props}
          {...this.state}
          title={formatMessage(messages.recent)}
          type="recent"
          theme={{classes}}
          list={recentList}
          goToChannel={this.goToChannel}
        />
      </div>
    )
  }

  renderNavigation() {
    if (this.props.isLoading) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.navigationWrapper}>
        <ManageButtons
          {...this.props}
          {...this.state}
          theme={{classes}}
        />
        {this.renderList()}
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.wrapper}>
        <div
          ref={this.onNavigationRef}
          onScroll={this.onScroll}
          className={classes.navigation}
        >
          <div ref={this.onListsContainerRef}>
            {this.renderNavigation()}
          </div>
        </div>
        <div className={classes.filter}>
          <Filter
            {...this.props}
            {...this.state}
            ref={this.onFilterRef}
            value={this.state.filter}
            theme={{classes}}
            onKeyDown={this.onKeyDownFilter}
            onChange={this.onChangeFilter}
          />
        </div>
      </div>
    )
  }
}
