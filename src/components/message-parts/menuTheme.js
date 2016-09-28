import {link, button} from 'grape-theme/dist/web-colors'
import {gray, red, white} from 'grape-theme/dist/base-colors'
import buttonIcon from '../button/icon'

const iconOptions = {
  color: gray,
  hoverColor: link,
  iconOnly: true
}

const fontSize = 13
const padding = 5
const firstLastPadding = 7
const borderSize = 1
const border = `${borderSize}px solid ${button}`

export function getWidth(itemsQuantity) {
  const itemWidth = fontSize + borderSize * 2 + padding * 2
  if (itemsQuantity === 1) return itemWidth

  const itemsWidth = (itemsQuantity - 2) * itemWidth
  const firstLastItemsWidth = fontSize + borderSize + firstLastPadding + padding
  return firstLastItemsWidth * 2 + (itemsWidth > 0 ? itemsWidth : 0)
}

export const styles = {
  menu: {
    display: 'inline-block',
    whiteSpace: 'nowrap'
  },
  editItem: buttonIcon('pencil', iconOptions),
  copyLinkItem: buttonIcon('iconLink', iconOptions),
  removeItem: buttonIcon('remove', {...iconOptions, hoverColor: red}),
  item: {
    padding,
    border,
    fontSize,
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: 1,
    background: white
  },
  firstItem: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    paddingLeft: firstLastPadding,
    borderRight: 0
  },
  lastItem: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    borderLeft: 0,
    paddingRight: firstLastPadding
  },
  singleItem: {
    borderRadius: '50%',
    border
  },
  nextToLastItem: {
    borderRight: border
  }
}
