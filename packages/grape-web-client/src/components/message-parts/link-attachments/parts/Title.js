import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import color from 'color'
import injectSheet from 'grape-web/lib/jss'
import { normal } from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'

const lighterLink = color(webColors.link)
  .lighten(0.2)
  .hexString()

@injectSheet({
  text: {
    isolate: false,
    extend: normal,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  title: {
    textDecoration: 'none',
    '& $text': {
      isolate: false,
      color: webColors.link,
    },
    '&:hover $text, &:focus $text': {
      isolate: false,
      textDecoration: 'none',
      color: lighterLink,
    },
  },
})
export default class Title extends PureComponent {
  static propTypes = {
    link: PropTypes.string,
    text: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    link: null,
  }

  renderText() {
    const { text, classes } = this.props

    return <span className={classes.text}>{text}</span>
  }

  renderWithLink() {
    const { link, classes } = this.props

    return (
      <a
        className={classes.title}
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
