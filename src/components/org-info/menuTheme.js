import {grayDarker} from 'grape-theme/dist/base-colors'
import {small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

export const styles = {
  menu: {
    minWidth: 220
  },
  anchorItem: {
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
      isolate: false,
      textDecoration: 'none'
    }
  },
  icon: {
    extend: normal,
    marginRight: 10,
    fill: grayDarker,
    cursor: 'inherit',
    flex: {
      grow: 0,
      basis: '10%'
    }
  },
  text: {
    extend: [small, ellipsis],
    width: '100%',
    flex: 1
  }
}
