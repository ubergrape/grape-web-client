import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import {styles} from './authorTheme.js'

@injectSheet(styles)
export default class Author extends PureComponent {
  renderIcon(icon) {
    const {sheet: {classes}} = this.props
    return <img className={classes.icon} src={icon} alt="" />
  }

  renderAuthor() {
    const {
      icon,
      name,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.container}>
        {icon && this.renderIcon(icon)}
        <span>{name}</span>
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
        className={cn(classes.container, classes.link)}
        href={link}
        target="_blank"
        rel="noreferrer">
        {this.renderAuthor()}
      </a>
    )
  }
}
