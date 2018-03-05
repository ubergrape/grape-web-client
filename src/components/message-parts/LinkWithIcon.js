import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {Link} from 'react-router-dom'
import injectSheet from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import icons from 'grape-web/lib/svg-icons/data'
import webColors from 'grape-theme/dist/web-colors'

import inlineLink from '../button/inlineLink'

@injectSheet({
  link: {
    ...inlineLink,
    wordBreak: 'break-word',
    cursor: 'pointer',
    '&:hover': {
      ...inlineLink['&:hover'],
      textDecoration: 'none',
      // Using border in order to underline the icon as well.
      borderBottom: [1, 'solid']
    }
  },
  icon: {
    display: 'inline-block',
    background: 'no-repeat',
    backgroundSize: 'contain',
    width: '1em',
    height: '1em'
  }
})
export default class LinkWithIcon extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string,
    children: PropTypes.node.isRequired,
    icon: PropTypes.string.isRequired,
    fakeLink: PropTypes.bool
  }

  static defaultProps = {
    url: '',
    icon: 'file',
    fakeLink: false
  }

  getSvg() {
    let {icon} = this.props
    if (icon === 'default' || !icons[icon]) {
      icon = this.constructor.defaultProps.icon
    }
    return getColoredIcon({name: icon, color: webColors.link})
  }

  render() {
    const {url, children, classes, fakeLink} = this.props

    const style = {backgroundImage: `url(${this.getSvg()})`}

    if (fakeLink) {
      return (
        <span className={classes.link}>
          <span className={classes.icon} style={style} />
          {' '}{children}
        </span>
      )
    }

    return (
      <Link to={url} className={classes.link}>
        <span className={classes.icon} style={style} />
        {' '}{children}
      </Link>
    )
  }
}
