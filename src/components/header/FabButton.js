import PropTypes from 'prop-types'
import React from 'react'
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
  label: {
    isolate: false,
    // This `before` pseudo-selector needs to implement `cursor: pointer` for SVG icon
    // https://stackoverflow.com/questions/19255296/is-there-a-way-to-use-svg-as-content-in-a-pseudo-element-before-or-after
    '&:before': {
      isolate: false,
      content: '""',
      position: 'absolute',
      width: iconSize,
      height: iconSize,
      cursor: 'pointer',
    },
    '&:hover > *': {
      isolate: false,
      width: iconSize,
      height: iconSize,
      color: palette.secondary.A200,
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
    color: ({ isSelected }) =>
      isSelected ? palette.secondary.A200 : palette.text.primary,
  },
})

const FabButton = ({ classes, onClick, isSelected, icon }) => (
  <Button
    raised
    fab
    onClick={onClick}
    className={classes[isSelected ? 'active' : 'root']}
    classes={{
      label: classes.label,
    }}
  >
    <Icon name={icon} className={classes.icon} />
  </Button>
)

FabButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  icon: PropTypes.oneOf(['at', 'tag', 'sidebar']).isRequired,
}

export default injectSheet(styles)(FabButton)
