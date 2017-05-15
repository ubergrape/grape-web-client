import PropTypes from 'prop-types'
import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import List from 'react-finite-list'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import style from '../../browser/style'
import Sidebar from '../../sidebar/Sidebar'
import SectionHeader from '../../section-header/SectionHeader'
import Detail from '../detail/Detail'
import Result from '../result/Result'
import {listTypes} from '../constants'

const messages = defineMessages({
  hint: {
    id: 'resultsAmountHint',
    defaultMessage: '{amount} results',
    description: 'Amount of results hin in the grape-search header.'
  }
})

/**
 * Search results.
 */
@injectSheet(style)
@injectIntl
export default class Results extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    focusedResult: PropTypes.object,
    focusedView: PropTypes.oneOf(listTypes),
    data: PropTypes.array,
    onSelect: PropTypes.func,
    onFocus: PropTypes.func
  }

  static defaultProps = {
    onSelect: noop,
    onFocus: noop
  }

  renderResult = ({item, focused}) => {
    const {
      intl: {formatMessage},
      focusedView,
      onFocus, onSelect
    } = this.props

    if (item.type === 'header') {
      return (
        <SectionHeader
          text={item.label}
          hint={formatMessage(messages.hint, {amount: item.resultsAmount})} />
      )
    }

    return (
      <Result
        {...item}
        onSelect={onSelect.bind(null, item)}
        onFocus={onFocus.bind(null, item)}
        isViewFocused={focusedView === 'results'}
        isFocused={focused}
        key={item.id} />
    )
  }

  render() {
    const {
      sheet: {classes}, focusedResult, data, ...rest
    } = this.props

    let details
    if (focusedResult) {
      const {detail, service} = focusedResult
      details = {...detail, service}
    }

    return (
      <div className={classes.column}>
        <div className={classes.row}>
          <List
            className={classes.leftColumn}
            renderItem={this.renderResult}
            items={data}
            focused={focusedResult} />
          <Sidebar className={classes.rightColumn}>
            <Detail {...rest} data={details} />
          </Sidebar>
        </div>
      </div>
    )
  }
}
