import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'material-ui/IconButton'
import Icon from 'grape-web/lib/svg-icons/Icon'

import {iconSize} from '../header'
import Dropdown from '../dropdown/Dropdown'
import Tooltip from '../tooltip/HoverTooltip'
import Menu from './Menu'

const SettingsButton = ({classes, onClick, onButtonRef}) => (
  <Tooltip
    message={(
      <FormattedMessage
        id="settings"
        defaultMessage="Settings"
      />
    )}
  >
    <IconButton onClick={onClick} rootRef={onButtonRef} className={classes.button}>
      <Icon name="cog" className={classes.buttonIcon} />
    </IconButton>
  </Tooltip>
)

const toggleMenu = state => ({showMenu: !state.showMenu})

@injectSheet(({palette}) => ({
  settings: {
    position: 'relative',
    flexShrink: 0
  },
  button: {
    width: iconSize,
    height: iconSize,
    display: 'flex'
  },
  buttonIcon: {
    isolate: false,
    stroke: palette.text.primary,
    '&:hover': {
      isolate: false,
      stroke: palette.accent.A200
    }
  }
}))
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
