import PropTypes from 'prop-types'
import React, { Component } from 'react'
import pick from 'lodash/pick'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import style from './style'
import Input from './InputWithScrollEvent'
import { getTextWithoutFilters, getFilterIds } from './utils'
import HighlightedInput from '../../highlighted-input/HighlightedInput'
import parseQuery from '../../query/parse'
import { SERVICES_TRIGGER } from '../../query/constants'

const messages = defineMessages({
  placeholder: {
    id: 'enterKeywordPlaceholder',
    defaultMessage: 'Enter a keyword…',
  },
})

class SearchInput extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    tokens: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onDidMount: PropTypes.func,
  }

  static defaultProps = {
    tokens: {},
    value: undefined,
    onChange: noop,
    onDidMount: noop,
  }

  constructor(props) {
    super(props)
    // We use state value to have update synced input first.
    // IE has unexpected timing issues somewhere otherwise when external service
    // with timeouts is used.
    this.state = { value: props.value }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    if (value !== this.state.value) this.setState({ value })
  }

  onChange = ({ value }) => {
    const { tokens } = this.props
    const split = this.input.splitByTokens()
    const search = getTextWithoutFilters(split, tokens)
    const filters = getFilterIds(split, tokens)
    const query = parseQuery(this.input.getTouchedWord())
    this.setState({ value }, () => {
      this.props.onChange({ value, search, filters, query })
    })
  }

  onMountInput = ref => {
    this.input = ref
    this.props.onDidMount(ref)
  }

  onShowServices = () => {
    this.input.insert(SERVICES_TRIGGER)
  }

  getTokenClass = () => this.props.sheet.classes.token

  render() {
    const {
      intl: { formatMessage },
      sheet: { classes },
    } = this.props
    const { value } = this.state

    return (
      <div className={classes.searchInput}>
        <span className={classes.magnifierIcon} />
        <HighlightedInput
          {...pick(
            this.props,
            'onBlur',
            'onChange',
            'onDidMount',
            'onKeyDown',
            'onKeyPress',
          )}
          value={value}
          Editable={Input}
          theme={classes}
          getTokenClass={this.getTokenClass}
          placeholder={formatMessage(messages.placeholder)}
          tokens={Object.keys(this.props.tokens)}
          onChange={this.onChange}
          onDidMount={this.onMountInput}
        />
        <button onClick={this.onShowServices} className={classes.plusButton} />
      </div>
    )
  }
}

export default injectSheet(style)(injectIntl(SearchInput))
