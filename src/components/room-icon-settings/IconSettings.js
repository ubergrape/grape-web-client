import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import colors from 'grape-theme/dist/base-colors'
import {icons, colors as roomColors} from 'grape-theme/dist/room-settings'

import Icon from '../room-icon/RoomIcon'
import {defaultRoomIconSlug} from '../../constants/images'


function RenderColors({theme, channel, onSetRoomColor}) {
  const {classes} = theme
  return (
    <div className={classes.roomColors}>
      <h1 className={classes.iconSettingsTitle}>
        <FormattedMessage
          id="RoomColor"
          defaultMessage="Room Color" />
      </h1>
      <ul className={classes.iconSettingsList}>
        {roomColors.map(color => {
          const isCurrent = channel.color === color
          return (
            <li
              className={classes.iconSettingsItem}
              key={color}>
              <button
                onClick={() => onSetRoomColor(color)}
                className={classes['chooserButton' + (isCurrent ? 'Active' : '')]}
                style={{backgroundColor: color}} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

RenderColors.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onSetRoomColor: PropTypes.func.isRequired
}

function RenderIcons({theme, channel, onSetRoomIcon}) {
  const {classes} = theme
  return (
    <div>
      <h1 className={classes.iconSettingsTitle}>
        <FormattedMessage
          id="RoomIcon"
          defaultMessage="Room Icon" />
      </h1>
      <ul className={classes.iconSettingsList}>
        {icons.map(slug => {
          const {icon} = channel
          const isCurrent = icon ? icon === slug : slug === defaultRoomIconSlug
          const iconTheme = {
            color: colors[isCurrent ? 'blue' : 'gray'],
            backgroundColor: colors.white
          }
          return (
            <li
              className={classes.iconSettingsItem}
              key={slug}>
              <button
                onClick={() => {onSetRoomIcon(slug)}}
                className={classes['chooserButton' + (isCurrent ? 'Active' : '')]}>
                  <Icon
                    className={classes.icon}
                    name={slug}
                    theme={iconTheme} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

RenderIcons.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onSetRoomIcon: PropTypes.func.isRequired
}


export default function IconSettings(props) {
  const {classes} = props.theme
  return (
    <section className={classes.iconSettings}>
      <RenderIcons {...props} />
      <RenderColors {...props} />
    </section>
  )
}

IconSettings.propTypes = {
  theme: PropTypes.object.isRequired
}
