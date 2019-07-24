import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/components/spinner'
import fonts from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import sizes from 'grape-theme/dist/sizes'

import { Divider, height as headerHeight } from '../header'
import Settings from './Settings'

const header = {
  extend: ellipsis,
  lineHeight: 'initial',
}

const styles = ({ palette }) => ({
  orgInfo: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: sizes.spacer.m,
    height: headerHeight,
    borderBottom: [1, 'solid', palette.text.divider],
    flexShrink: 0,
  },
  logoContainer: {
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    marginRight: sizes.spacer.s,
    borderRadius: '50%',
    width: sizes.icon.xl,
    height: sizes.icon.xl,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    flexBasis: 'auto',
    overflow: 'hidden',
    marginRight: sizes.spacer.xs,
    cursor: 'default',
  },
  orgName: {
    extend: [fonts.normal, header],
    lineHeight: 1,
    color: palette.common.black,
  },
  userName: {
    extend: [fonts.small, header],
    color: palette.grey[100],
  },
  divider: {
    position: 'absolute',
    right: 0,
  },
})

const LogoImage = ({ classes, logo, name }) => (
  <img className={classes.logoImage} src={logo} alt={name} />
)

const Logo = ({ isLoading, classes, ...rest }) => (
  <span className={classes.logoContainer}>
    {isLoading ? (
      <Spinner size="s" />
    ) : (
      <LogoImage classes={classes} {...rest} />
    )}
  </span>
)

const Info = ({ classes, name, user }) => (
  <div className={classes.info}>
    <div>
      <h1 className={classes.orgName}>{name}</h1>
      <h2 className={classes.userName}>{user.displayName}</h2>
    </div>
  </div>
)

@injectSheet(styles)
export default class OrgInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    colors: PropTypes.object,
    isLoading: PropTypes.bool,
    logo: PropTypes.string,
    name: PropTypes.string,
    user: PropTypes.shape({
      displayName: PropTypes.string,
    }),
  }

  static defaultProps = {
    isLoading: false,
    colors: {},
    logo: '',
    name: '',
    user: undefined,
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
        <Logo classes={classes} isLoading={isLoading} name={name} logo={logo} />
        {!isLoading && user && (
          <Info classes={classes} name={name} user={user} />
        )}
        {!isLoading && user && <Settings {...settingsProps} user={user} />}
        <Divider className={classes.divider} />
      </header>
    )
  }
}
