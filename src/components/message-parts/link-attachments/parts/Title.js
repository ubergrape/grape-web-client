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

  renderText() {
    const {
      text,
      sheet: {classes}
    } = this.props

    return (
      <span className={classes.container}>
        {text}
      </span>
    )
  }

  renderWithLink() {
    const {
      link,
      sheet: {classes}
    } = this.props

    return (
      <a
        className={classes.link}
        target="_blank"
        rel="noopener noreferrer"
        href={link}
      >
        {this.renderText()}
      </a>
    )
  }

  render() {
    if (this.props.link) {
      return this.renderWithLink()
    }

    return this.renderText()
  }
}
