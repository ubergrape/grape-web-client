import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/components/spinner'
import fonts from 'grape-theme/dist/fonts'
import {grayLight, black} from 'grape-theme/dist/base-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import sizes from 'grape-theme/dist/sizes'

import {Divider, height as headerHeight} from '../header'
import Settings from './Settings'

const header = {
  extend: ellipsis,
  lineHeight: 'initial'
}

const styles = ({palette}) => ({
  orgInfo: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: sizes.spacer.m,
    height: headerHeight,
    borderBottom: [1, 'solid', palette.grey[300]],
    flexShrink: 0
  },
  logoContainer: {
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    marginRight: sizes.spacer.s,
    borderRadius: '50%',
    width: sizes.icon.l,
    height: sizes.icon.l
  },
  logoImage: {
    widht: '100%',
    height: '100%'
  },
  info: {
    flex: 1,
    flexBasis: 'auto',
    overflow: 'hidden',
    marginRight: sizes.spacer.xs,
    cursor: 'default'
  },
  orgName: {
    extend: [fonts.normal, header],
    lineHeight: 1,
    color: black
  },
  userName: {
    extend: [fonts.small, header],
    color: grayLight
  }
})


const LogoImage = ({classes, logo, name}) => (
  <img
    className={classes.logoImage}
    src={logo}
    alt={name}
  />
)

const Logo = ({isLoading, classes, ...rest}) => (
  <span
    className={classes.logoContainer}
  >
    {isLoading ? <Spinner size="s" /> : <LogoImage classes={classes} {...rest} />}
  </span>
)

const Info = ({classes, name, user}) => (
  <div className={classes.info}>
    <div>
      <h1 className={classes.orgName}>
        {name}
      </h1>
      <h2 className={classes.userName}>
        {user.displayName}
      </h2>
    </div>
  </div>
)

@injectSheet(styles)
export default class OrgInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    logo: PropTypes.string,
    name: PropTypes.string,
    user: PropTypes.shape({
      displayName: PropTypes.string
    })
  }

  static defaultProps = {
    isLoading: false
  }

  render() {
    const {
      classes,
      isLoading,
      name,
      user,
      logo,
      ...settingsProps
    } = this.props

    return (
      <header className={classes.orgInfo}>
        <Logo
          classes={classes}
          isLoading={isLoading}
          name={name}
          logo={logo}
        />
        {!isLoading && user && <Info classes={classes} name={name} user={user} />}
        {!isLoading && user && <Settings {...settingsProps} user={user} />}
        <Divider />
      </header>
    )
  }
}
