import {link, button} from 'grape-theme/dist/web-colors'
import {gray, red, white} from 'grape-theme/dist/base-colors'
import buttonIcon from '../button/icon'

const iconOptions = {
  color: gray,
  hoverColor: link,
  iconOnly: true
}

const border = `1px solid ${button}`

export const styles = {
  menu: {
    display: 'inline-block'
  },
  editItem: buttonIcon('pencil', iconOptions),
  copyLinkItem: buttonIcon('iconLink', iconOptions),
  removeItem: buttonIcon('remove', {...iconOptions, hoverColor: red}),
  item: {
    padding: 5,
    border,
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: 1,
    background: white
  },
  firstItem: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    paddingLeft: 7,
    borderRight: 0
  },
  lastItem: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    borderLeft: 0,
    paddingRight: 7
  },
  singleItem: {
    borderRadius: '50%',
    border
  },
  nextToLastItem: {
    borderRight: border
  }
}
