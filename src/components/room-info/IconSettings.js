import React, {PropTypes} from 'react'

import colors from 'grape-theme/dist/base-colors'
import roomColors from 'grape-theme/dist/room-icon-color-palette'
import icons from 'grape-theme/dist/room-icons'

import Icon from '../room-icon/RoomIcon'
import {defaultRoomIconSlug} from '../../constants/images'


function renderColors({classes, channel, onSetRoomColor}) {
  return (
    <div className={classes.roomColors}>
      <h1 className={classes.iconSettingsTitle}>Room Color</h1>
      <ul className={classes.iconSettingsList}>
        {roomColors.map(color => {
          const isCurrent = channel.color === color
          return (
            <li
              className={classes.iconSettingsItem}
              key={color}>
              <button
                onClick={() => { onSetRoomColor(color) }}
                className={classes['chooserButton' + (isCurrent ? 'Active' : '')]}
                style={{backgroundColor: color}} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

renderColors.propTypes = {
  channel: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onSetRoomColor: PropTypes.func.isRequired
}

function renderIcons({classes, channel, onSetRoomIcon}) {
  return (
    <div>
      <h1 className={classes.iconSettingsTitle}>Room Icon</h1>
      <ul className={classes.iconSettingsList}>
        {icons.map(slug => {
          const {icon} = channel
          const isCurrent = icon ? icon === slug : slug === defaultRoomIconSlug
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
                    color={colors[isCurrent ? 'blue' : 'gray']}
                    backgroundColor={colors.white}
                    size="32" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

renderIcons.propTypes = {
  channel: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onSetRoomIcon: PropTypes.func.isRequired
}


export default function IconSettings(props) {
  return (
    <section className={props.classes.iconSettings}>
      {renderIcons(props)}
      {renderColors(props)}
    </section>
  )
}

IconSettings.propTypes = {
  classes: PropTypes.object.isRequired
}
