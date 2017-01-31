import React, {PureComponent, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import BaseSpinner from 'grape-web/lib/spinner/Spinner'

import {styles, logoSize} from './orgInfoTheme'
import {spinner} from '../../constants/images'
import Tooltip from '../tooltip/HoverTooltip'

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

const SettingsButton = ({classes, onClick}) => (
  <Tooltip
    message={(
      <FormattedMessage
        id="settings"
        defaultMessage="Settings"
      />
    )}
  >
    <button
      className={classes.settingsButton}
      onClick={onClick}
    />
  </Tooltip>
)

@injectSheet(styles)
export default class OrgInfo extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    toggleOrgSettings: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    logo: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string
  }

  onToggleSettingsMenu = (e) => {
    this.props.toggleOrgSettings(e.target)
  }

  render() {
    const {
      sheet: {classes},
      isLoading,
      name,
      username,
      logo
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
        {!isLoading && <SettingsButton classes={classes} onClick={this.onToggleSettingsMenu} />}
      </header>
    )
  }
}
