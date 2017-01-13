import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

// import {styles} from './authorTheme.js'

// @injectSheet(styles)
export default class Author extends PureComponent {
  renderIcon() {
    const {icon} = this.props
    return <img src={icon} alt="" />
  }

  renderAuthor() {
    const {
      icon,
      name
    } = this.props

    return (
      <div>
        {icon && this.renderIcon()}
        <span>{name}</span>
      </div>
    )
  }

  render() {
    const {
      link
    } = this.props

    return (
      <div>
        {
          link ?
          <a href={link}>{this.renderAuthor()}</a> :
          this.renderAuthor()
        }
      </div>
    )
  }
}
