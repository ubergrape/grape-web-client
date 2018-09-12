import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import MuiMenuItem from 'grape-web/lib/components/menu/menuItem'
import { grayDarker } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import { isElectron } from 'grape-web/lib/x-platform/electron'

const styles = {
  item: {
    '&:hover *': {
      isolate: false,
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  anchorItem: {
    composes: '$item',
    display: 'block',
    textDecoration: 'none',
  },
  icon: {
    extend: fonts.normal,
    marginRight: 10,
    color: grayDarker,
    flex: {
      grow: 0,
      basis: '10%',
    },
  },
  text: {
    extend: [fonts.small, ellipsis],
    width: '100%',
    flex: 1,
  },
}

const MenuItem = ({ classes, icon, children, onClick, href, target }) => {
  const item = (
    <MuiMenuItem className={classes.item} onClick={onClick} dense>
      <Icon name={icon} className={classes.icon} />
      <span className={classes.text}>{children}</span>
    </MuiMenuItem>
  )

  if (href) {
    return (
      <a
        href={`${href}${isElectron ? '?platform=electron' : ''}`}
        target={target}
        className={classes.anchorItem}
      >
        {item}
      </a>
    )
  }

  return item
}

export default injectSheet(styles)(MenuItem)
