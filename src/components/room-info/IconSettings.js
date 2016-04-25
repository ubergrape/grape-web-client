import React, {PropTypes} from 'react'
import colors from 'grape-theme/dist/base-colors'
import roomColors from 'grape-theme/dist/room-icon-color-palette'
import Icon from '../room-icon/RoomIcon'

const icons = ['bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb', 'bulb']

function renderColors({classes, channel}) {
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
                onClick={() => {console.log('xxx')}}
                className={classes['iconChooserButton' + (isCurrent ? 'Active' : '')]}
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
  classes: PropTypes.object.isRequired
}

function renderIcons({classes, channel}) {
  return (
    <div>
      <h1 className={classes.iconSettingsTitle}>Room Icon</h1>
      <ul className={classes.iconSettingsList}>
        {icons.map((icon, i) => {
          const isCurrent = channel.icon === icon
          return (
            <li
              className={classes.iconSettingsItem}
              key={icon + i}>
              <button
                onClick={() => {console.log('yyy')}}
                className={classes['iconChooserButton' + (isCurrent ? 'Active' : '')]}>
                  <Icon
                    name={`room${icon[0].toUpperCase()}${icon.slice(1)}`}
                    color={colors.gray}
                    backgroundColor={colors.white}
                    size="24" />
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
  classes: PropTypes.object.isRequired
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
