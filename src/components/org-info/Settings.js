import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'grape-web/lib/components/icon-button'
import Icon from 'grape-web/lib/svg-icons/Icon'
import sizes from 'grape-theme/dist/sizes'

import Dropdown from '../dropdown/Dropdown'
import Tooltip from '../tooltip/HoverTooltip'
import { iconSize } from '../header'
import Menu from './Menu'

const SettingsButton = ({ classes, onClick, onButtonRef, disabled }) => (
  <Tooltip
    message={<FormattedMessage id="settings" defaultMessage="Settings" />}
    disabled={disabled}
  >
    <IconButton
      onClick={onClick}
      rootRef={onButtonRef}
      className={classes.button}
    >
      <Icon name="cog" className={classes.buttonIcon} />
    </IconButton>
  </Tooltip>
)

const toggleMenu = state => ({ showMenu: !state.showMenu })

@injectSheet(({ palette }) => ({
  settings: {
    position: 'relative',
    flexShrink: 0,
    marginRight: sizes.spacer.s,
  },
  button: {
    display: 'flex',
    width: iconSize + 16,
    height: iconSize + 16,
  },
  buttonIcon: {
    isolate: false,
    width: iconSize,
    height: iconSize,
    color: palette.text.primary,
    '&:hover': {
      isolate: false,
      width: iconSize,
      height: iconSize,
      cursor: 'pointer',
      color: ({ colors }) => colors.button || palette.secondary.A200,
    },
  },
}))
export default class Settings extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onShowIntro: PropTypes.func.isRequired,
  }

  state = { showMenu: false }

  onToggleMenu = e => {
    e.stopPropagation()
    this.setState(toggleMenu)
  }

  onHideMenu = () => {
    this.setState({ showMenu: false })
  }

  onSettingsButtonRef = ref => {
    this.buttonRef = ref
  }

  onGetSettingsButton = () => this.buttonRef

  onInvite = () => {
    this.onHideMenu()
    this.props.onInvite()
  }

  onShowIntro = () => {
    this.onHideMenu()
    this.props.onShowIntro({
      via: 'user menu',
      force: true,
    })
  }

  render() {
    const { classes, ...menuProps } = this.props

    const { showMenu } = this.state

    return (
      <div className={classes.settings}>
        <SettingsButton
          classes={classes}
          onClick={this.onToggleMenu}
          onButtonRef={this.onSettingsButtonRef}
          disabled={showMenu}
        />
        {showMenu && (
          <Dropdown
            target={this.buttonRef}
            onOutsideClick={this.onHideMenu}
            placement="bottom"
            container={this}
          >
            <Menu
              {...menuProps}
              onInvite={this.onInvite}
              onShowIntro={this.onShowIntro}
            />
          </Dropdown>
        )}
      </div>
    )
  }
}
