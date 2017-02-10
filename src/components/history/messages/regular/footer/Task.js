import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import Icon from 'grape-web/lib/svg-icons/Icon'

import Dropdown from '../../../../dropdown/Dropdown'
import Tooltip from '../../../../tooltip/HoverTooltip'
import IconButton from './IconButton'
import {styles} from './taskTheme'

const TaskButton = ({classes, isConnected, amount, onClick, onRefButton}) => (
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
      ref={onRefButton}
    >
      {!isConnected && <Icon name="lightningBolt" className={classes.taskButtonIcon} />}
      {isConnected && <Icon name="lightningBolt" className={classes.taskButtonIconConnected} />}
      {isConnected && <Icon name="checkCircle" className={classes.taskButtonIconConnectedCheckmark} />}
      <span className={classes.taskButtonText}>{amount}</span>
    </IconButton>
  </Tooltip>
)

const toggleOpenState = state => ({isOpen: !state.isOpen})

@injectSheet(styles)
export default class Task extends PureComponent {
  state = {isOpen: false}

  onToggleDropdown = (e) => {
    e.stopPropagation()
    this.setState(toggleOpenState)
  }

  onHideDropdown = () => {
    this.setState({isOpen: false})
  }

  onRefButton = (ref) => {
    this.button = ref
  }

  render() {
    const {
      classes,
      nlp: {
        amount,
        isConnected
      }
    } = this.props
    const {isOpen} = this.state

    return (
      <div className={classes.task}>
        <TaskButton
          classes={classes}
          onRefButton={this.onRefButton}
          onClick={this.onToggleDropdown}
          isConnected={isConnected}
          amount={amount}
        />
        {isOpen &&
          <Dropdown
            target={this.button}
            onOutsideClick={this.onHideDropdown}
            placement="top"
            container={this}
          >
          test
          </Dropdown>
        }

      </div>
    )
  }
}
