import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import baseColors from 'grape-theme/dist/base-colors'
import { icons, colors as roomColors } from 'grape-theme/dist/room-settings'

import Icon from '../room-icon/RoomIcon'
import { defaultIconSlug } from '../../../constants/channel'

function RenderColors({ theme, channel, onSetRoomColor }) {
  const { classes } = theme
  return (
    <div className={classes.roomColors}>
      <h1 className={classes.iconSettingsTitle}>
        <FormattedMessage id="groupColor" defaultMessage="Group Color" />
      </h1>
      <ul className={classes.iconSettingsList}>
        {roomColors.map(color => {
          const isCurrent = channel.color === color
          return (
            <li className={classes.iconSettingsItem} key={color}>
              <button
                onClick={() => onSetRoomColor(color)}
                className={classes[`chooserButton${isCurrent ? 'Active' : ''}`]}
                style={{ backgroundColor: color }}
              />
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
  onSetRoomColor: PropTypes.func.isRequired,
}

function RenderIcons({ theme, colors, channel, onSetRoomIcon }) {
  const { classes } = theme
  return (
    <div>
      <h1 className={classes.iconSettingsTitle}>
        <FormattedMessage id="groupIcon" defaultMessage="Group Icon" />
      </h1>
      <ul className={classes.iconSettingsList}>
        {icons.map(slug => {
          const { icon } = channel
          const isCurrent = icon ? icon === slug : slug === defaultIconSlug
          const iconTheme = {
            color: isCurrent
              ? colors.button || baseColors.blue
              : baseColors.gray,
            backgroundColor: baseColors.white,
          }
          return (
            <li className={classes.iconSettingsItem} key={slug}>
              <div
                className={classes[`chooserButton${isCurrent ? 'Active' : ''}`]}
              >
                <Icon
                  onClick={() => {
                    onSetRoomIcon(slug)
                  }}
                  className={classes.icon}
                  name={slug}
                  theme={iconTheme}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

RenderIcons.propTypes = {
  channel: PropTypes.object.isRequired,
  colors: PropTypes.object,
  theme: PropTypes.object.isRequired,
  onSetRoomIcon: PropTypes.func.isRequired,
}

RenderIcons.defaultProps = {
  colors: {},
}

export default function IconSettings(props) {
  const { classes } = props.theme
  return (
    <section className={classes.iconSettings}>
      <RenderIcons {...props} />
      <RenderColors {...props} />
    </section>
  )
}

IconSettings.propTypes = {
  theme: PropTypes.object.isRequired,
}
