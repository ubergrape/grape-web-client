import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Fuse from 'fuse.js'
import keyname from 'keyname'
import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

import Filter from './Filter'
import List from './List'
import FilteredList from './FilteredList'
import Channel from './Channel'
import ManageButtons from './ManageButtons'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    shortcuts: PropTypes.array.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPmManager: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    focusGrapeInput: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    all: PropTypes.array.isRequired,
    favorited: PropTypes.array.isRequired,
    recent: PropTypes.array.isRequired,
    step: PropTypes.number.isRequired,
    bottomOffset: PropTypes.number.isRequired
  }

  static defaultProps = {
    step: 10,
    bottomOffset: 5,
    shortcuts: ['mod+k']
  }

  constructor(props) {
    super(props)
    this.state = {
      shift: 20,
      filter: '',
      filtered: [],
      filteredUnJoined: []
    }

    mousetrap.bindGlobal(props.shortcuts, ::this.onShortcut)
  }

  componentDidMount() {
    this.filter = findDOMNode(this.refs.filter)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.all !== this.props.all) {
      this.setState({
        fuseJoined: new Fuse(
          nextProps.all,
          {keys: ['name'], threshold: 0.3}
        ),
        fuseUnJoined: new Fuse(
          nextProps.unJoined,
          {keys: ['name'], threshold: 0.3}
        )
      })
    }

    const {shift, filter} = this.state
    const {listsContainer, navigation} = this.refs
    const {recent, step} = nextProps
    if (filter || recent.length < shift) return

    if (
      listsContainer &&
      listsContainer.offsetHeight &&
      listsContainer.offsetHeight < navigation.offsetHeight
    ) {
      this.setState({
        shift: shift + step
      })
    }
  }

  onShortcut() {
    this.filter.focus()
  }

  onScroll(e) {
    const {recent, bottomOffset} = this.props
    if (this.state.shift >= recent.length) return

    const {offsetHeight, scrollTop, scrollHeight} = e.target
    if (offsetHeight + scrollTop + bottomOffset >= scrollHeight) {
      this.setState({
        shift: this.state.shift + this.props.step
      })
    }
  }

  onSelectFiltered(channel) {
    this.goToChannel(channel)
  }

  onChangeFilter({target}) {
    const {value} = target
    const filtered = this.state.fuseJoined.search(value)
    const filteredUnJoined = this.state.fuseUnJoined.search(value)

    this.setState({
      filtered,
      filteredUnJoined,
      filter: value,
      focusedChannel: filtered[0]
    })
  }

  onFocusFiltered(channel) {
    this.setState({focusedChannel: channel})
  }

  onKeyDownFilter(e) {
    const keyName = keyname(e.keyCode)

    if (keyName === 'esc' && !this.filter.value) {
      this.filter.blur()
      this.props.focusGrapeInput()
    }
    const {filteredList} = this.refs
    if (!filteredList) return
    switch (keyName) {
      case 'up':
        filteredList.focus('prev')
        e.preventDefault()
        break
      case 'down':
        filteredList.focus('next')
        e.preventDefault()
        break
      case 'enter':
        this.onSelectFiltered(this.state.focusedChannel)
        e.preventDefault()
        break
      default:
    }
  }

  goToChannel(channel) {
    this.props.goToChannel(channel.slug || channel.mate.slug)
    this.setState({
      filter: '',
      filtered: [],
      focusedChannel: null
    })
  }

  renderFilteredChannel({item: channel, focused}) {
    const {classes} = this.props.sheet
    const isFirstInUnJoined = channel === this.state.filteredUnJoined[0]

    return (
      <Channel
        {...this.props}
        {...this.state}
        header={isFirstInUnJoined ? 'No conversation yet' : ''}
        channel={channel}
        focused={focused}
        theme={{classes}}
        onClick={this.goToChannel.bind(this, channel)}/>
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
          ref="filteredList"
          renderItem={::this.renderFilteredChannel}
          onSelect={::this.onSelectFiltered}
          onFocus={::this.onFocusFiltered}
          onMouseOver={::this.onFocusFiltered} />
      )
    }

    const {recent} = this.props
    const {shift} = this.state
    const recentList = recent.length > shift ? recent.slice(0, shift) : recent

    return (
      <div>
        <List
          {...this.props}
          {...this.state}
          title="Favorites"
          type="favorites"
          theme={{classes}}
          list={this.props.favorited}
          goToChannel={::this.goToChannel} />
        <List
          {...this.props}
          {...this.state}
          title="Recent"
          type="recent"
          theme={{classes}}
          list={recentList}
          goToChannel={::this.goToChannel} />
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
            ref="navigation"
            onScroll={::this.onScroll}
            className={classes.navigation}>
            <div ref="listsContainer">
              {this.renderNavigation()}
            </div>
          </div>
          <div className={classes.filter}>
            <Filter
              {...this.props}
              {...this.state}
              ref="filter"
              value={this.state.filter}
              theme={{classes}}
              onKeyDown={::this.onKeyDownFilter}
              onChange={::this.onChangeFilter} />
          </div>
      </div>
    )
  }
}
