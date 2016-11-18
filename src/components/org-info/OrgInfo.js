import React, {PureComponent, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'

import {styles} from './theme'
import {spinner} from '../../constants/images'
import Tooltip from '../tooltip/HoverTooltip'

const sizes = {width: 32, height: 32}

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

  toggleOrgSettings = (e) => {
    this.props.toggleOrgSettings(e.target)
  }

  renderLogo() {
    const {
      sheet: {classes},
      logo,
      name
    } = this.props

    return (
      <img
        className={classes.logoImage}
        src={logo}
        alt={name}
        style={sizes} />
    )
  }

  renderHeaders() {
    const {
      sheet: {classes},
      name,
      username,
      isLoading
    } = this.props

    if (isLoading) return null

    return (
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
  }

  render() {
    const {
      sheet: {classes},
      isLoading
    } = this.props

    return (
      <header className={classes.orgInfo}>
        <span
          style={sizes}
          className={classes.logo}>
          {isLoading ? <Spinner image={spinner} size={sizes.height} /> : this.renderLogo() }
        </span>
        {this.renderHeaders()}
        {!isLoading && (
          <Tooltip
            message={(
              <FormattedMessage
                id="settings"
                defaultMessage="Settings" />
            )}>
            <button
              className={classes.settings}
              onClick={this.toggleOrgSettings}>
            </button>
          </Tooltip>
        )}
      </header>
    )
  }
}
