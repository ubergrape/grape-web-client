import {grayDarker, blue, white} from 'grape-theme/dist/base-colors'
import {small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

export const styles = {
  menu: {
    width: 220,
    '& > a': {
      textDecoration: 'none'
    },
    // FIXME need to decrease source order for material-ui sheets
    '& $item': {
      cursor: 'pointer',
      extend: [small, ellipsis],
      display: 'flex',
      padding: [10, 16],
      height: 'auto',
      '&:hover': {
        isolate: false,
        color: white,
        backgroundColor: blue,
        '& > $icon': {
          isolate: false,
          fill: white
        }
      }
    }
  },
  item: {},
  icon: {
    extend: normal,
    marginRight: 10,
    width: 16,
    fill: grayDarker,
    cursor: 'inherit'
  }
}
