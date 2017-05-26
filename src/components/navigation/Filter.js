import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {pickHTMLProps} from 'pick-react-known-prop'
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
    filter: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const {formatMessage} = this.props.intl
    const {classes} = this.props.theme
    return (
      <input
        {...pickHTMLProps(this.props)}
        type="search"
        placeholder={formatMessage(messages.placeholder)}
        className={classes.filterInput}
      />
    )
  }
}
