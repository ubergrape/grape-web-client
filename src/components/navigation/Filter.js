import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

const messages = defineMessages({
  placeholder: {
    id: 'searchPropleAndGroups',
    defaultMessage: 'Search people and groups…'
  }
})

@injectIntl
export default class Filter extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    value: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const {formatMessage} = this.props.intl
    const {classes} = this.props.theme
    const {value, onKeyUp, onChange} = this.props

    return (
      <input
        type="search"
        value={value}
        onKeyUp={onKeyUp}
        onChange={onChange}
        placeholder={formatMessage(messages.placeholder)}
        className={classes.filterInput}
      />
    )
  }
}
