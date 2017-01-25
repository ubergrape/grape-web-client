import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './imagePreviewLinkTheme.js'

@injectSheet(styles)
export default class ImagePreviewLink extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    permalink: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      url,
      permalink,
      sheet: {classes}
    } = this.props

    return (
      <a
        className={classes.link}
        href={permalink}
        target="_blank"
        rel="noreferrer">
        <img src={url} alt="" />
      </a>
    )
  }
}
