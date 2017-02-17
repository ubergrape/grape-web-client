import React, {PureComponent} from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import BaseIconButton from 'material-ui/IconButton'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import {smaller} from 'grape-theme/dist/fonts'

const size = 32

@injectSheet({
  iconButton: {
    fontSize: smaller.fontSize,
    width: size,
    height: size,
    '&, *': {
      isolate: false,
      cursor: 'pointer'
    }
  },
  iconButtonIcon: {
    fontSize: 'inherit'
  }
})
export default class IconButton extends PureComponent {
  render() {
    const {classes, icon, onClick, className} = this.props
    return (
      <BaseIconButton className={cn(classes.iconButton, className)} onClick={onClick}>
        <Icon name={icon} className={classes.iconButtonIcon} />
      </BaseIconButton>
    )
  }
}

