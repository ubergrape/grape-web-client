import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import BaseIconButton from 'grape-web/lib/components/icon-button'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import { smaller } from 'grape-theme/dist/fonts'
import { icon as iconSize } from 'grape-theme/dist/sizes'

@injectSheet({
  iconButton: {
    fontSize: smaller.fontSize,
    width: iconSize.l,
    height: iconSize.l,
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  iconButtonIcon: {
    fontSize: 'inherit',
  },
})
export default class IconButton extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: null,
    icon: null,
    onClick: null,
  }

  render() {
    const { classes, icon, onClick, className } = this.props
    return (
      <BaseIconButton
        className={cn(classes.iconButton, className)}
        onClick={onClick}
      >
        <Icon name={icon} className={classes.iconButtonIcon} />
      </BaseIconButton>
    )
  }
}
