import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './footerTheme.js'

@injectSheet(styles)
export default class Footer extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    link: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      link,
      text,
      sheet: {classes}
    } = this.props

    let children
    if (link) {
      children = (
        <a
          className={classes.link}
          target="_blank"
          rel="noreferrer"
          href={link}
          >{text}</a>
      )
    } else {
      children = text
    }

    return (
      <div className={classes.container}>
        {children}
      </div>
    )
  }
}
