import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

const messages = defineMessages({
  placeholder: {
    id: 'searchPeopleAndGroups',
    defaultMessage: 'Search people and groups…'
  }
})

@injectIntl
export default class Filter extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    value: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const {formatMessage} = this.props.intl
    const {classes} = this.props.theme
    const {value, onKeyDown, onChange} = this.props

    return (
      <input
        type="search"
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        placeholder={formatMessage(messages.placeholder)}
        className={classes.filterInput}
      />
    )
  }
}
