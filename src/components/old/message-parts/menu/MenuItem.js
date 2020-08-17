import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import Tooltip from '../../tooltip/HoverTooltip'
import buttonIcon from '../../button/icon'
import * as messages from './messages'
import { firstLastPadding, padding, fontSize, borderSize } from './constants'

const getItemClassName = (classes, name, index, total) => {
  const classNames = [classes[`${name}Item`], classes.item]

  if (total === 1) {
    classNames.push(classes.singleItem)
  } else {
    if (index === 0) {
      classNames.push(classes.firstItem)
      if (total === 2) classNames.push(classes.nextToLastItem)
    }
    if (index === total - 1) classNames.push(classes.lastItem)
  }

  return classNames.join(' ')
}

const getIcon = (name, palette) => {
  const options = {
    color: palette.text.primary,
    hoverColor: palette.secondary.A200,
    iconOnly: true,
  }

  if (name === 'deleteMessage') {
    Object.assign(options, { hoverColor: palette.error[500] })
  }

  return buttonIcon(name, options)
}

class MenuItem extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onRefItem: PropTypes.func,
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }

  static defaultProps = {
    onRefItem: undefined,
  }

  onSelect = () => {
    const { onSelect, name } = this.props
    onSelect({ name })
  }

  render() {
    const { name, classes, index, total, onRefItem } = this.props

    return (
      <Tooltip key={name} placement="top" message={messages[name]}>
        <button
          className={getItemClassName(classes, name, index, total)}
          onClick={this.onSelect}
          ref={onRefItem}
        />
      </Tooltip>
    )
  }
}

export default injectSheet(({ palette }) => ({
  editItem: getIcon('pencil', palette),
  copyLinkItem: getIcon('iconLink', palette),
  removeItem: getIcon('deleteMessage', palette),
  // As requested in GRAPE-14402 we use this icon also for removingLinks
  removeLinkAttachmentItem: getIcon('deleteMessage', palette),
  quoteItem: getIcon('quoteLeft', palette),
  moreItem: getIcon('moreOptions', palette),
  unpinItem: getIcon('unpin', palette),
  item: {
    padding,
    border: [borderSize, 'solid', palette.blueGrey[400]],
    borderLeftColor: palette.blueGrey[50],
    borderRightColor: palette.blueGrey[50],
    fontSize,
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: 1,
    background: palette.background.paper,
  },
  firstItem: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderRight: 0,
    borderLeftColor: palette.blueGrey[400],
    paddingLeft: firstLastPadding,
  },
  lastItem: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    borderLeft: 0,
    borderRightColor: palette.blueGrey[400],
    paddingRight: firstLastPadding,
  },
  singleItem: {
    borderRadius: '50%',
    border: [borderSize, 'solid', palette.blueGrey[400]],
  },
  nextToLastItem: {
    borderRight: [borderSize, 'solid', palette.blueGrey[50]],
  },
}))(MenuItem)
