import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'

import Dropdown from '../dropdown/Dropdown'
import Tooltip from '../tooltip/HoverTooltip'
import Menu from './Menu'
import {styles} from './settingsTheme'

const SettingsButton = ({classes, onClick, onButtonRef}) => (
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
      ref={onButtonRef}
    >
      <Icon name="cog" className={classes.settingsButtonIcon} />
    </button>
  </Tooltip>
)

const toggleMenu = state => ({showMenu: !state.showMenu})

@injectSheet(styles)
export default class Settings extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onshowIntro: PropTypes.func.isRequired
  }

  state = {showMenu: false}

  onToggleMenu = (e) => {
    e.stopPropagation()
    this.setState(toggleMenu)
  }

  onHideMenu = () => {
    this.setState({showMenu: false})
  }

  onSettingsButtonRef = (ref) => {
    this.buttonRef = ref
  }

  onGetSettingsButton = () => this.buttonRef

  onInvite = () => {
    this.onHideMenu()
    this.props.onInvite()
  }

  onshowIntro = () => {
    this.onHideMenu()
    this.props.onshowIntro({
      via: 'user menu',
      force: true
    })
  }

  render() {
    const {
      classes,
      ...menuProps
    } = this.props

    const {showMenu} = this.state

    return (
      <div className={classes.settings}>
        <SettingsButton
          classes={classes}
          onClick={this.onToggleMenu}
          onButtonRef={this.onSettingsButtonRef}
        />
        {showMenu &&
          <Dropdown
            target={this.buttonRef}
            onOutsideClick={this.onHideMenu}
            placement="bottom"
            container={this}
          >
            <Menu
              {...menuProps}
              onInvite={this.onInvite}
              onshowIntro={this.onshowIntro}
            />
          </Dropdown>
        }
      </div>
    )
  }
}
