import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import MenuItem from 'grape-web/lib/components/menu/menuItem'
import fonts from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'

import * as messages from './messages'

@injectSheet({
  root: {
    '&:hover *': {
      isolate: false,
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  icon: {
    extend: fonts.normal,
    marginRight: 10,
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
})
export default class PopoverItem extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  }

  onSelect = () => {
    const { onSelect, name } = this.props
    onSelect({ name })
  }

  render() {
    const { classes, icon, name, style, parent, scrollTop } = this.props

    return (
      <MenuItem
        className={classes.root}
        onClick={this.onSelect}
        dense
      >
        <Icon name={icon} className={classes.icon} />
        <span className={classes.text}>{messages[name]}</span>
      </MenuItem>
    )
  }
}
