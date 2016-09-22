import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import {useSheet} from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'

import style from './style'
import {spinner} from '../../constants/images'
import Tooltip from '../tooltip/HoverTooltip'

const sizes = {width: 32, height: 32}

@useSheet(style)
export default class OrgInfo extends Component {
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
      sheet,
      logo,
      name
    } = this.props

    return (
      <img
        className={sheet.classes.logoImage}
        src={logo}
        alt={name}
        style={sizes} />
    )
  }

  renderHeaders() {
    const {
      sheet,
      name,
      username,
      isLoading
    } = this.props

    if (isLoading) return null

    return (
      <div className={sheet.classes.headers}>
        <div>
          <h1 className={sheet.classes.orgName}>
            {name}
          </h1>
          <h2 className={sheet.classes.userName}>
            {username}
          </h2>
        </div>
      </div>
    )
  }

  render() {
    const {sheet, isLoading} = this.props

    return (
      <header className={sheet.classes.orgInfo}>
        <span
          style={sizes}
          className={sheet.classes.logo}>
          {isLoading ? <Spinner image={spinner} size={sizes.height} /> : this.renderLogo() }
        </span>
        {this.renderHeaders()}
        {
          !isLoading &&
          <Tooltip
            message={(
              <FormattedMessage
                id="settings"
                defaultMessage="Settings" />
            )}>
            <button
              className={sheet.classes.settings}
              onClick={this.toggleOrgSettings}>
            </button>
          </Tooltip>
        }
      </header>
    )
  }
}
