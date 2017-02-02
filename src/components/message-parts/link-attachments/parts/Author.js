import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './authorTheme.js'

@injectSheet(styles)
export default class Author extends PureComponent {
  static propTypes = {
    iconUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  renderIcon(iconUrl) {
    const {sheet: {classes}} = this.props
    return <img className={classes.icon} src={iconUrl} alt="" />
  }

  renderAuthor() {
    const {
      iconUrl,
      name,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.container}>
        {iconUrl && this.renderIcon(iconUrl)}
        <span className={classes.text}>{name}</span>
      </div>
    )
  }

  render() {
    const {
      link,
      sheet: {classes}
    } = this.props

    if (!link) {
      return this.renderAuthor()
    }

    return (
      <a
        className={classes.link}
        href={link}
        target="_blank"
        rel="noreferrer">
        {this.renderAuthor()}
      </a>
    )
  }
}
