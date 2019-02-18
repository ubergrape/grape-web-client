import icons from 'grape-web/lib/svg-icons/data'
import webColors from 'grape-theme/dist/web-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

export default (name, options) => {
  let icon = name
  if (icon === 'default' || !icons[icon]) {
    icon = options.defaultIcon
  }
  return getColoredIcon({ name: icon, color: webColors.link })
}
