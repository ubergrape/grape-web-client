import icons from 'grape-web/lib/svg-icons/data'
import webColors from 'grape-theme/dist/web-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

export default name =>
  getColoredIcon({
    name: name === 'default' || !icons[name] ? 'file' : name,
    color: webColors.link,
  })
