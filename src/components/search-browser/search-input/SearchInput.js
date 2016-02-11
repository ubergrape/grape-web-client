import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'
import Input from './Input'
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
    return (
        <div className={classes.searchInput}>
          <span className={classes.icon} />
          <HighlightedInput
            {...this.props}
            Editable={Input}
            theme={classes}
            getTokenClass={::this.getTokenClass}
            placeholder="Grape Search"
            tokens={Object.keys(this.props.tokens)} />
        </div>
    )
  }
}
