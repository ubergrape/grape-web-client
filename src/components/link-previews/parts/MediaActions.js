import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './mediaActionsTheme.js'

@injectSheet(styles)
export default class Image extends PureComponent {
  render() {
    const {
      parmalink,
      onPlay,
      sheet: {classes}
    } = this.props

    return (
      <div>
        <button onClick={onPlay}>play</button>
        <a
          rel="noreferrer"
          target="_blank"
          href={parmalink}
          >
          external
        </a>
      </div>
    )
  }
}
