import React, {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'
import Input from './InputWithScrollEvent'
import HighlightedInput from '../../highlighted-input/HighlightedInput'

@useSheet(style)
export default class Browser extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    tokens: PropTypes.object
  }

  getTokenClass() {
    return this.props.sheet.classes.token
  }

  render() {
    const {classes} = this.props.sheet
    const inputProps = pick(this.props, 'onBlur', 'onChange', 'onDidMount',
      'onKeyDown', 'onKeyPress', 'value')

    return (
        <div className={classes.searchInput}>
          <span className={classes.icon} />
          <HighlightedInput
            {...inputProps}
            Editable={Input}
            theme={classes}
            getTokenClass={::this.getTokenClass}
            placeholder="Grape Search"
            tokens={Object.keys(this.props.tokens)} />
        </div>
    )
  }
}
