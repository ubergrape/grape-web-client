import PropTypes from 'prop-types'
import React from 'react'

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

const Filter = ({intl, theme, onKeyDown, onChange}) => (
  <input
    type="search"
    onKeyDown={onKeyDown}
    onChange={onChange}
    placeholder={intl.formatMessage(messages.placeholder)}
    className={theme.classes.filterInput}
  />
)

Filter.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(Filter)
