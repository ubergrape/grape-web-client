import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import List from 'react-finite-list'
import { FormattedMessage } from 'react-intl'

export default class FilteredList extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    foundChannels: PropTypes.array.isRequired,
    focusedChannel: PropTypes.object,
    searchingChannels: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    focusedChannel: undefined,
  }

  onRefList = list => {
    this.list = list
  }

  focus(direction) {
    this.list.focus(direction)
  }

  render() {
    const {
      filter,
      foundChannels,
      focusedChannel,
      searchingChannels,
      theme,
    } = this.props
    const { classes } = theme
    if (searchingChannels) {
      return (
        <div className={classes.notFound}>
          <FormattedMessage
            id="searchMembersAndGroups"
            defaultMessage="Search members and groups…"
          />
        </div>
      )
    }
    if (!foundChannels.length) {
      return (
        <div className={classes.notFound}>
          <FormattedMessage
            id="nothingThatMatches"
            defaultMessage="There's nothing that matches"
          />{' '}
          <strong>{filter}</strong>
        </div>
      )
    }

    return (
      <List
        {...this.props}
        items={foundChannels}
        focused={focusedChannel}
        ref={this.onRefList}
        style={{}}
      />
    )
  }
}
