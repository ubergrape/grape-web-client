import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import Button from 'grape-web/lib/components/button'
import Icon from 'grape-web/lib/svg-icons/Icon'

import { iconSize } from './constants'

const styles = ({ palette }) => ({
  root: {
    border: 'none',
    width: iconSize + 16,
    height: iconSize + 16,
    color: palette.blueGrey[100],
    background: ({ isSelected }) =>
      isSelected ? palette.blueGrey[50] : 'none',
    '&:hover': {
      isolate: false,
      background: 'none',
    },
    '&:active': {
      isolate: false,
      boxShadow: 'none',
    },
  },
  // TODO use function value once https://github.com/cssinjs/react-jss/issues/165
  // is fixed.
  active: {
    composes: '$root',
    background: palette.blueGrey[50],
    '&:hover': {
      isolate: false,
      background: palette.blueGrey[50],
    },
  },
  icon: {
    width: iconSize,
    height: iconSize,
    cursor: 'inherit',
    color: ({ isSelected, colors }) =>
      isSelected
        ? colors.button || palette.secondary.A200
        : palette.text.primary,
    '&:hover': {
      isolate: false,
      width: iconSize,
      height: iconSize,
      cursor: 'pointer',
      color: ({ colors }) => colors.button || palette.secondary.A200,
    },
  },
})

const FabButton = ({ classes, onClick, isSelected, icon }) => (
  <Button
    raised
    fab
    onClick={onClick}
    className={classes[isSelected ? 'active' : 'root']}
  >
    <Icon name={icon} className={cn(classes.icon, classes.iconHover)} />
  </Button>
)

FabButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  icon: PropTypes.oneOf(['at', 'tag', 'sidebar']).isRequired,
}

export default injectSheet(styles)(FabButton)
