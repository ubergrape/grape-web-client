import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './titleTheme.js'

@injectSheet(styles)
export default class Title extends PureComponent {
  render() {
    const {
      link,
      text,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.container}>
        {link ?
          <a
            className={classes.link}
            target="_blank"
            rel="noreferrer"
            href={link}
            >{text}</a> :
          text
        }
      </div>
    )
  }
}
