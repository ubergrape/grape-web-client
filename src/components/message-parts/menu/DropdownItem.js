import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import MuiMenuItem from 'material-ui/Menu/MenuItem'
import fonts from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

import * as messages from './messages'

const styles = {
  root: {
    '&:hover *': {
      isolate: false,
      textDecoration: 'none',
      cursor: 'pointer'
    }
  },
  icon: {
    extend: fonts.normal,
    marginRight: 10,
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

const DropdownItem = ({classes, icon, name, onClick}) => (
  <MuiMenuItem className={classes.root} onClick={onClick} dense>
    <Icon name={icon} className={classes.icon} />
    <span className={classes.text}>{messages[name]}</span>
  </MuiMenuItem>
)

export default injectSheet(styles)(DropdownItem)
