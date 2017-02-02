import React, {PureComponent, PropTypes} from 'react'
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
    sheet: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onShowTutorial: PropTypes.func.isRequired
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

  onShowTutorial = () => {
    this.onHideMenu()
    this.props.onShowTutorial({
      via: 'user menu',
      force: true
    })
  }

  render() {
    const {
      sheet: {classes},
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
              onShowTutorial={this.onShowTutorial}
            />
          </Dropdown>
        }
      </div>
    )
  }
}
