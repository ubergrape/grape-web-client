import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/components/spinner'

import Settings from './Settings'
import {styles} from './orgInfoTheme'

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
      </header>
    )
  }
}
