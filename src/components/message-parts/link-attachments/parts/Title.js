import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import color from 'color'
import injectSheet from 'grape-web/lib/jss'
import {normal} from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'

@injectSheet({
  text: {
    extend: normal,
    fontWeight: 'bold',
    lineHeight: 1.4
  },
  link: {
    textDecoration: 'none',
    '& $text': {
      isolate: false,
      color: webColors.link,
      '&:hover, &:focus': {
        isolate: false,
        textDecoration: 'none',
        color: color(webColors.link).lighten(0.2).hexString(),
        borderBottom: {
          width: 1,
          style: 'solid'
        }
      }
    }
  }
})
export default class Title extends PureComponent {
  static propTypes = {
    link: PropTypes.string,
    text: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
  }

  static defaultProps = {
    link: null
  }

  renderText() {
    const {
      text,
      classes
    } = this.props

    return (
      <span className={classes.text}>
        {text}
      </span>
    )
  }

  renderWithLink() {
    const {
      link,
      classes
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
