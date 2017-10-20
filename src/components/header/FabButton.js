import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import Button from 'material-ui/Button'

import {iconSize} from './constants'

const styles = () => ({
  root: {
    border: 'none',
    width: iconSize + 18,
    height: iconSize + 18,
    background: ({isSelected}) => (isSelected ? '#EBEEF3' : 'none'),
    '&:hover': {
      isolate: false,
      background: 'none'
    }
  },
  // TODO use function value once https://github.com/cssinjs/react-jss/issues/165
  // is fixed.
  active: {
    composes: '$root',
    background: '#EBEEF3',
    '&:hover': {
      isolate: false,
      background: '#EBEEF3'
    }
  }
})

const FabButton = ({classes, onClick, isSelected, children}) => (
  <Button
    raised
    fab
    onClick={onClick}
    className={classes[isSelected ? 'active' : 'root']}
  >
    {children}
  </Button>
)

FabButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default injectSheet(styles)(FabButton)
