import buttonIcon from '../../button/icon'

const fontSize = 16
const padding = 4
const firstLastPadding = 6
const borderSize = 1

export function getWidth(itemsQuantity) {
  const itemWidth = fontSize + (borderSize * 2) + (padding * 2)
  if (itemsQuantity === 1) return itemWidth

  const itemsWidth = (itemsQuantity - 2) * itemWidth
  const firstLastItemsWidth = fontSize + borderSize + firstLastPadding + padding
  return (firstLastItemsWidth * 2) + (itemsWidth > 0 ? itemsWidth : 0)
}

const getIcon = (name, palette) => {
  const options = {
    color: palette.text.primary,
    hoverColor: palette.accent.A200,
    iconOnly: true
  }

  if (name === 'bin' || name === 'deleteMessage') {
    Object.assign(options, {hoverColor: palette.error[500]})
  }

  return buttonIcon(name, options)
}

export const styles = ({palette}) => ({
  menu: {
    display: 'inline-block',
    whiteSpace: 'nowrap'
  },
  editItem: getIcon('pencil', palette),
  copyLinkItem: getIcon('link', palette),
  removeItem: getIcon('deleteMessage', palette),
  removeLinkAttachmentItem: getIcon('bin', palette),
  quoteItem: getIcon('quoteLeft', palette),
  moreItem: getIcon('moreOptions', palette),
  item: {
    padding,
    border: [borderSize, 'solid', palette.blueGrey[400]],
    borderLeftColor: palette.blueGrey[50],
    borderRightColor: palette.blueGrey[50],
    fontSize,
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: 1,
    background: palette.background.paper
  },
  firstItem: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderRight: 0,
    borderLeftColor: palette.blueGrey[400],
    paddingLeft: firstLastPadding
  },
  lastItem: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    borderLeft: 0,
    borderRightColor: palette.blueGrey[400],
    paddingRight: firstLastPadding
  },
  singleItem: {
    borderRadius: '50%',
    border: [borderSize, 'solid', palette.blueGrey[400]]
  },
  nextToLastItem: {
    borderRight: [borderSize, 'solid', palette.blueGrey[50]]
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
  },
  dropdownList: {
    width: 200,
    padding: 0
  }
})
