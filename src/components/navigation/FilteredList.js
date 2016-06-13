import React, {Component, PropTypes} from 'react'
import List from 'react-finite-list'

export default class FilteredList extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    filtered: PropTypes.array.isRequired,
    filteredUnJoined: PropTypes.array.isRequired,
    focusedChannel: PropTypes.any
  }

  focus(direction) {
    this.refs.list.focus(direction)
  }

  render() {
    const {
      filter,
      filtered,
      filteredUnJoined,
      focusedChannel,
      theme
    } = this.props
    const {classes} = theme
    if (!filtered.length && !filteredUnJoined.length) {
      return (
        <div className={classes.notFound}>
          {'There\'s nothing that matches '}
          <strong>{filter}</strong>
        </div>
      )
    }

    const items = filtered.concat(filteredUnJoined)
    return (
      <List
        {...this.props}
        items={items}
        focused={focusedChannel || items[0]}
        ref="list" />
    )
  }
}
