import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import List from 'react-finite-list'
import {FormattedMessage} from 'react-intl'

export default class FilteredList extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    filtered: PropTypes.array.isRequired,
    filteredUnJoined: PropTypes.array.isRequired,
    focusedChannel: PropTypes.any.isRequired
  }

  onRefList = (list) => {
    this.list = list
  }

  focus(direction) {
    this.list.focus(direction)
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
          <FormattedMessage
            id="nothingThatMatches"
            defaultMessage="There's nothing that matches"
          />
          {' '}
          <strong>{filter}</strong>
        </div>
      )
    }

    return (
      <List
        {...this.props}
        items={filtered}
        focused={focusedChannel || filtered[0]}
        ref={this.onRefList}
      />
    )
  }
}
