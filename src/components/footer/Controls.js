import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './controlsTheme'

@injectSheet(styles)
export default class Controls extends PureComponent {
  render() {
    const {sheet: {classes}} = this.props
    return (
      <div className={classes.controls}>
        <button className={classes.attachment} />
        <button className={classes.emoji} />
        <button className={classes.search} />
      </div>
    )
  }
}
