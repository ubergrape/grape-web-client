import {grayDarker} from 'grape-theme/dist/base-colors'
import {small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

export const styles = {
  menu: {
    minWidth: 220
  },
  anchorItem: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  icon: {
    extend: normal,
    marginRight: 10,
    fill: grayDarker,
    cursor: 'inherit'
  },
  text: {
    extend: [small, ellipsis],
    width: '100%'
  }
}
