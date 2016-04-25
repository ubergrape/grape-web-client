import React, {PropTypes} from 'react'
import colors from 'grape-theme/dist/room-icon-color-palette'

function renderColors({classes, channel}) {
  return (
    <div>
      <h1>Room Color</h1>
      <ul>
        {colors.map(color => {
          const isCurrent = channel.color === color
          return (
            <li
              className={classes.roomColorItem}
              key={color}>
              <button
                onClick={() => {console.log('xxx')}}
                className={classes['roomColorButton' + (isCurrent ? 'Active' : '')]}
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


export default function IconSettings(props) {
  const {
    classes
  } = props

  return (
    <section className={classes.iconSettings}>
      <h1>Room Icon</h1>
      {renderColors(props)}
    </section>
  )
}

IconSettings.propTypes = {
  classes: PropTypes.object.isRequired
}
