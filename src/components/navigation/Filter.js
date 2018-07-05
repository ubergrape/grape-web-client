import PropTypes from 'prop-types'
import React from 'react'

import { defineMessages, intlShape, injectIntl } from 'react-intl'

const messages = defineMessages({
  placeholder: {
    id: 'searchPeopleAndGroups',
    defaultMessage: 'Search people and groups…',
  },
})

const Filter = ({ innerRef, intl, theme, value, onKeyDown, onChange }) => (
  <input
    ref={innerRef}
    type="search"
    value={value}
    onKeyDown={onKeyDown}
    onChange={onChange}
    placeholder={intl.formatMessage(messages.placeholder)}
    className={theme.classes.filterInput}
  />
)

Filter.propTypes = {
  innerRef: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default injectIntl(Filter)
