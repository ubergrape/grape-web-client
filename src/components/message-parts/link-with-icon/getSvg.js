import icons from 'grape-web/lib/svg-icons/data'
import webColors from 'grape-theme/dist/web-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

export default (name, props) => {
  let icon = name
  if (icon === 'default' || !icons[icon]) {
    const { icon: defaultIcon } = props
    icon = defaultIcon
  }
  return getColoredIcon({ name: icon, color: webColors.link })
}
