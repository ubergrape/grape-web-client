import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './authorTheme.js'

@injectSheet(styles)
export default class Author extends PureComponent {
  static propTypes = {
    iconUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    sheet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    iconUrl: null,
    link: null,
  }

  renderIcon(iconUrl) {
    const {
      sheet: { classes },
    } = this.props
    return <img className={classes.icon} src={iconUrl} alt="" />
  }

  renderAuthor() {
    const {
      iconUrl,
      name,
      sheet: { classes },
    } = this.props

    return (
      <span className={classes.container}>
        {iconUrl && this.renderIcon(iconUrl)}
        <span className={classes.text}>{name}</span>
      </span>
    )
  }

  renderAuthorWithLink() {
    const {
      link,
      sheet: { classes },
    } = this.props

    return (
      <a
        className={classes.link}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {this.renderAuthor()}
      </a>
    )
  }

  render() {
    if (this.props.link) {
      return this.renderAuthorWithLink()
    }

    return this.renderAuthor()
  }
}
