import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import List from 'react-finite-list'

import style from '../../browser/style'
import Sidebar from '../../sidebar/Sidebar'
import SectionHeader from '../../section-header/SectionHeader'
import Detail from '../detail/Detail'
import Result from '../result/Result'
import {listTypes} from '../constants'

/**
 * Search results.
 */
@useSheet(style)
export default class Results extends Component {
  static propTypes = {
    sheet: PropTypes.object,
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

  renderResult({item, focused}) {
    if (item.type === 'header') {
      return <SectionHeader text={item.label} hint={item.hint} />
    }

    return (
      <Result
        {...item}
        onSelect={this.props.onSelect.bind(null, item)}
        onFocus={this.props.onFocus.bind(null, item)}
        isViewFocused={this.props.focusedView === 'results'}
        isFocused={focused}
        key={item.id} />
    )
  }

  render() {
    const {classes} = this.props.sheet
    const {focusedResult} = this.props

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
            renderItem={::this.renderResult}
            items={this.props.data}
            focused={this.props.focusedResult} />
          <Sidebar className={classes.rightColumn}>
            <Detail {...this.props} data={details} />
          </Sidebar>
        </div>
      </div>
    )
  }
}
