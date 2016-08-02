import React, {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import {useSheet} from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import style from './style'
import Input from './InputWithScrollEvent'
import {
  getTextWithoutFilters,
  getFilterIds
} from './utils'
import HighlightedInput from '../../highlighted-input/HighlightedInput'
import parseQuery from '../../query/parse'
import {SERVICES_TRIGGER} from '../../query/constants'

const messages = defineMessages({
  placeholder: {
    id: 'grapeSearch',
    defaultMessage: 'Grape Search'
  }
})

@useSheet(style)
@injectIntl
export default class Browser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    tokens: PropTypes.object,
    onChange: PropTypes.func,
    onDidMount: PropTypes.func
  }

  onChange({value}) {
    const {tokens} = this.props
    const split = this.input.splitByTokens()
    const search = getTextWithoutFilters(split, tokens)
    const filters = getFilterIds(split, tokens)
    const query = parseQuery(this.input.getTouchedWord())
    this.props.onChange({value, search, filters, query})
  }

  onMountInput(ref) {
    this.input = ref
    this.props.onDidMount(ref)
  }

  onShowServices() {
    this.input.insert(SERVICES_TRIGGER)
  }

  getTokenClass() {
    return this.props.sheet.classes.token
  }

  render() {
    const {formatMessage} = this.props.intl
    const inputProps = pick(this.props, 'onBlur', 'onChange', 'onDidMount',
      'onKeyDown', 'onKeyPress', 'value')

    const {classes} = this.props.sheet
    return (
        <div className={classes.searchInput}>
          <span className={classes.magnifierIcon} />
          <HighlightedInput
            {...inputProps}
            Editable={Input}
            theme={classes}
            getTokenClass={::this.getTokenClass}
            placeholder={formatMessage(messages.placeholder)}
            tokens={Object.keys(this.props.tokens)}
            onChange={::this.onChange}
            onDidMount={::this.onMountInput} />
          <button
            onClick={::this.onShowServices}
            className={classes.plusButton}></button>
        </div>
    )
  }
}
