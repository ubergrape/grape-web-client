import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white, grayBlueDark} from 'grape-theme/dist/base-colors'

export default {
  lock: {
    position: 'absolute',
    overflow: 'hidden',
    border: 'solid',
    borderRadius: '50%',
    background: `${grayBlueDark} url(${getColoredIcon({name: 'lock', color: white})}) 50% 50% no-repeat`,
    backgroundSize: '70%'
  }
}
