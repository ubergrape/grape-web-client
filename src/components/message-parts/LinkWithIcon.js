import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import { Link } from 'grape-web/lib/router'
import icons from 'grape-web/lib/svg-icons/data'
import webColors from 'grape-theme/dist/web-colors'

import inlineLink from '../button/inlineLink'

@injectSheet({
  link: {
    extends: inlineLink,
    wordBreak: 'break-word',
    '&:hover': {
      ...inlineLink['&:hover'],
      textDecoration: 'none',
      // Using border in order to underline the icon as well.
      borderBottom: [1, 'solid'],
    },
  },
  icon: {
    display: 'inline-block',
    background: 'no-repeat',
    backgroundSize: 'contain',
    width: '1em',
    height: '1em',
  },
})
export default class LinkWithIcon extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    icon: PropTypes.string,
  }

  static defaultProps = {
    icon: 'file',
  }

  getSvg() {
    let { icon } = this.props
    if (icon === 'default' || !icons[icon]) {
      const { icon: defaultIcon } = this.constructor.defaultProps
      icon = defaultIcon
    }
    return getColoredIcon({ name: icon, color: webColors.link })
  }

  render() {
    const { url, children, classes } = this.props

    const style = { backgroundImage: `url(${this.getSvg()})` }

    return (
      <Link to={url}>
        <span className={classes.icon} style={style} /> {children}
      </Link>
    )
  }
}
