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

const Header = ({classes, name, user}) => (
  <div className={classes.headers}>
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
    sheet: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    logo: PropTypes.string,
    name: PropTypes.string,
    user: PropTypes.shape({
      displayName: PropTypes.string
    })
  }

  render() {
    const {
      sheet: {classes},
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
        {!isLoading && <Header classes={classes} name={name} user={user} />}
        {!isLoading && <Settings {...settingsProps} user={user} />}
      </header>
    )
  }
}
