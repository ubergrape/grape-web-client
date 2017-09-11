import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import MuiMenuItem from 'material-ui/Menu/MenuItem'
import {grayDarker} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

const styles = {
  item: {
    '&:hover *': {
      isolate: false,
      textDecoration: 'none',
      cursor: 'pointer'
    }
  },
  anchorItem: {
    composes: '$item',
    display: 'block',
    textDecoration: 'none'
  },
  icon: {
    extend: fonts.normal,
    marginRight: 10,
    fill: grayDarker,
    flex: {
      grow: 0,
      basis: '10%'
    }
  },
  text: {
    extend: [fonts.small, ellipsis],
    width: '100%',
    flex: 1
  }
}

const MenuItem = ({classes, icon, children, onClick, href, target}) => {
  const item = (
    <MuiMenuItem className={classes.item} onClick={onClick} dense>
      <Icon name={icon} className={classes.icon} />
      <span className={classes.text}>{children}</span>
    </MuiMenuItem>
  )

  if (href) {
    return (
      <a
        href={href}
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
