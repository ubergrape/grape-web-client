import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
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
export default class Filter extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    filter: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {formatMessage} = this.props.intl
    const {classes} = this.props.theme
    return (
      <input
        {...pickHTMLProps(this.props)}
        type="search"
        placeholder={formatMessage(messages.placeholder)}
        className={classes.filterInput} />
    )
  }
}
