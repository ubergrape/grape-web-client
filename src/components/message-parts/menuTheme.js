import buttonIcon from '../button/icon'

const fontSize = 13
const padding = 5
const firstLastPadding = 7
const borderSize = 1

export function getWidth(itemsQuantity) {
  const itemWidth = fontSize + (borderSize * 2) + (padding * 2)
  if (itemsQuantity === 1) return itemWidth

  const itemsWidth = (itemsQuantity - 2) * itemWidth
  const firstLastItemsWidth = fontSize + borderSize + firstLastPadding + padding
  return (firstLastItemsWidth * 2) + (itemsWidth > 0 ? itemsWidth : 0)
}

export const styles = ({palette}) => {
  const border = [borderSize, 'solid', palette.blueGrey[400]]

  const iconOptions = {
    color: palette.text.primary,
    hoverColor: palette.accent.A200,
    iconOnly: true
  }

  const binIconOptions = {...iconOptions, hoverColor: palette.error[500]}

  return {
    menu: {
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    editItem: buttonIcon('pencil', iconOptions),
    moreItem: buttonIcon('moreOptions', iconOptions),
    copyLinkItem: buttonIcon('link', iconOptions),
    removeItem: buttonIcon('bin', binIconOptions),
    removeLinkAttachmentItem: buttonIcon('bin', binIconOptions),
    quoteItem: buttonIcon('quoteLeft', iconOptions),
    item: {
      padding,
      border,
      fontSize,
      cursor: 'pointer',
      textAlign: 'center',
      lineHeight: 1,
      background: palette.background.paper
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
    },
    top: {
      position: 'absolute',
      top: -13,
      right: 15
    },
    right: {
      position: 'absolute',
      top: 1,
      left: `calc(100% + ${firstLastPadding}px)`
    }
  }
}
