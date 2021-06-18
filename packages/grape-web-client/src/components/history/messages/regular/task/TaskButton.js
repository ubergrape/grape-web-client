import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import IconButton from 'grape-web/lib/components/icon-button'
import color from 'color'
import { grayLight, white } from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'
import { smaller, small } from 'grape-theme/dist/fonts'

import Tooltip from '../../../../tooltip/HoverTooltip'
import TaskIcon from './TaskIcon'

@injectSheet({
  taskButton: {
    width: 'auto',
    height: 20,
    fontSize: smaller.fontSize,
    border: [
      1,
      'solid',
      color(grayLight)
        .alpha(0.5)
        .rgbaString(),
    ],
    borderRadius: 4,
    padding: [0, 5],
    backgroundColor: white,
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  taskButtonIcon: {
    marginRight: 5,
  },
  taskButtonText: {
    extend: small,
    color: grayLight,
  },
})
export default class TaskButton extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isConnected: PropTypes.bool,
    amount: PropTypes.number,
    onClick: PropTypes.func,
    onRefButton: PropTypes.func,
  }

  static defaultProps = {
    amount: 0,
    isConnected: false,
    onClick: null,
    onRefButton: null,
  }

  render() {
    const { classes, isConnected, amount, onClick, onRefButton } = this.props
    return (
      <Tooltip
        message={
          <FormattedMessage
            id="tasksTooltip"
            defaultMessage="Tasks"
            description="Message NLP task button tooltip."
          />
        }
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
