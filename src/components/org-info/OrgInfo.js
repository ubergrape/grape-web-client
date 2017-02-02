import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import BaseSpinner from 'grape-web/lib/spinner/Spinner'

import {spinner} from '../../constants/images'
import Settings from './Settings'
import {styles, logoSize} from './orgInfoTheme'

const Spinner = () => <BaseSpinner image={spinner} size={logoSize} />

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
    {isLoading ? <Spinner /> : <LogoImage classes={classes} {...rest} />}
  </span>
)

const Header = ({classes, name, username}) => (
  <div className={classes.headers}>
    <div>
      <h1 className={classes.orgName}>
        {name}
      </h1>
      <h2 className={classes.userName}>
        {username}
      </h2>
    </div>
  </div>
)

@injectSheet(styles)
export default class OrgInfo extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onInvite: PropTypes.func.isRequired,
    onShowTutorial: PropTypes.func.isRequired,
    logo: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string
  }

  render() {
    const {
      sheet: {classes},
      isLoading,
      name,
      username,
      logo,
      onInvite,
      onShowTutorial
    } = this.props

    return (
      <header className={classes.orgInfo}>
        <Logo
          classes={classes}
          isLoading={isLoading}
          name={name}
          logo={logo}
        />
        {!isLoading && <Header classes={classes} name={name} username={username} />}
        <Settings
          onInvite={onInvite}
          onShowTutorial={onShowTutorial}
        />
      </header>
    )
  }
}
