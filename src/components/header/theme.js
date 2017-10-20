import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {gray, grayDarker, grayBlueDark, blue, white} from 'grape-theme/dist/base-colors'
import {borderDefault} from 'grape-theme/dist/web-colors'
import {small, big} from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

import {height} from './constants'

export const styles = () => ({
  header: {
    display: 'flex',
    height,
    padding: [0, 25],
    alignItems: 'center',
    borderBottom: [1, 'solid', borderDefault],
    flexShrink: 0
  },
  headerDisabled: {
    opacity: 0.4,
    WebkitFilter: 'grayscale(100%)',
    filter: 'grayscale(100%)',
    pointerEvents: 'none'
  },
  favorite: {
    listStyle: 'none',
    flexShrink: 0,
    position: 'relative',
    marginRight: 5
  },
  title: {
    listStyle: 'none',
    overflow: 'hidden',
    flexGrow: 1,
    minWidth: 50,
    paddingLeft: 10
  },
  name: {
    ...ellipsis,
    ...big,
    fontWeight: 'bold',
    lineHeight: 1.2,
    color: grayDarker
  },
  description: {
    ...ellipsis,
    ...small,
    lineHeight: 1.2,
    color: gray
  },
  action: {
    listStyle: 'none',
    position: 'relative',
    flexShrink: 0,
    marginLeft: 5,
    lineHeight: 0
  },
  searchAction: {
    listStyle: 'none',
    marginLeft: 5,
    lineHeight: 0,
    flex: [0, 1, 237],
    minWidth: 165
  },
  search: {
    extend: small,
    background: {
      color: white,
      repeat: 'no-repeat',
      position: [12, '50%']
    },
    backgroundImage: `url('${getColoredIcon({name: 'magnifier', color: grayBlueDark})}')`,
    border: [1, 'solid', borderDefault],
    padding: [7, 10, 7, 35],
    color: grayBlueDark,
    borderRadius: sizes.borderRadius.bigger,
    outline: 'none',
    width: '100%',
    '&::-webkit-search-cancel-button': {
      isolate: false,
      WebkitAppearance: 'searchfield-cancel-button !important'
    },
    '&:focus': {
      isolate: false,
      borderColor: blue
    }
  }
})
