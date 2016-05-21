import React, {Component, PropTypes} from 'react'
import List from 'react-finite-list'

export default class FilteredList extends Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    filtered: PropTypes.array.isRequired,
    focusedChannel: PropTypes.any
  }

  focus(direction) {
    this.refs.list.focus(direction)
  }

  render() {
    const {
      filter,
      filtered,
      focusedChannel,
      theme
    } = this.props
    const {classes} = theme
    if (!filtered.length) {
      return (
        <div className={classes.notFound}>
          {'There\'s nothing that matches '}
          <strong>{filter}</strong>
        </div>
      )
    }
    return (
      <List
        {...this.props}
        items={filtered}
        focused={focusedChannel}
        ref="list"
        />
    )
  }
}
