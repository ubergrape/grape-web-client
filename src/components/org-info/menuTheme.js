import {grayDarker, white} from 'grape-theme/dist/base-colors'
import {small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {create as createMuiTheme} from 'grape-web/lib/mui-theme'

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
  item: {
    '&:hover > $icon': {
      fill: white
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

export const mui = createMuiTheme({
  overrides: {
    ListItem: {
      default: {
        paddingTop: 10,
        paddingBottom: 10
      }
    }
  }
})
