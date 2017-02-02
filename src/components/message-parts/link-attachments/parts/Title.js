import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './titleTheme.js'

@injectSheet(styles)
export default class Title extends PureComponent {
  static propTypes = {
    link: PropTypes.string,
    text: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    link: null
  }

  renderWithLink() {
    const {
      link,
      text,
      sheet: {classes}
    } = this.props

    return (
      <a
        className={classes.link}
        target="_blank"
        rel="noopener noreferrer"
        href={link}
      >
        {text}
      </a>
    )
  }

  render() {
    const {
      link,
      text,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.container}>
        {link ? this.renderWithLink() : text}
      </div>
    )
  }
}
