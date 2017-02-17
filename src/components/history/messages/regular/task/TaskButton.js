import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import IconButton from 'material-ui/IconButton'
import color from 'color'
import {grayLight, white} from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'
import {small} from 'grape-theme/dist/fonts'

import Tooltip from '../../../../tooltip/HoverTooltip'
import TaskIcon from './TaskIcon'

@injectSheet({
  taskButton: {
    width: 'auto',
    height: 20,
    fontSize: 11,
    border: [1, 'solid', color(grayLight).alpha(0.5).rgbaString()],
    borderRadius: 4,
    padding: [0, 5],
    backgroundColor: white,
    '&, *': {
      isolate: false,
      cursor: 'pointer'
    }
  },
  taskButtonIcon: {
    marginRight: 5
  },
  taskButtonText: {
    extend: small,
    color: grayLight
  }
})
export default class TaskButton extends PureComponent {
  render() {
    const {classes, isConnected, amount, onClick, onRefButton} = this.props
    return (
      <Tooltip
        message={(
          <FormattedMessage
            id="tasks"
            defaultMessage="Tasks"
          />
        )}
      >
        <IconButton
          className={classes.taskButton}
          onClick={onClick}
          buttonRef={onRefButton}
        >
          <TaskIcon
            isConnected={isConnected}
            className={classes.taskButtonIcon}
          />
          <span className={classes.taskButtonText}>{amount}</span>
        </IconButton>
      </Tooltip>
    )
  }
}
