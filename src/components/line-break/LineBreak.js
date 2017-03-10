import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'

@injectSheet(styles)
export default class LineBreak extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }
  render() {
    const {sheet: {classes}} = this.props
    return <span className={classes.lineBreak} role="presentation"><br /></span>
  }
}
