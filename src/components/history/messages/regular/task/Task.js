import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import injectSheet from 'grape-web/lib/jss'

import Dropdown from '../../../../dropdown/Dropdown'
import TaskButton from './TaskButton'
import TasksList from './TasksList'

const toggleOpenState = state => ({isOpen: !state.isOpen})

@injectSheet({
  task: {
    position: 'relative',
    display: 'inline-block'
  }
})
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
    this.buttonNode = findDOMNode(ref)
  }

  onSelectTask = () => {
    // TODO implement it
  }

  onRemoveTask = () => {
    // TODO implement it
  }

  render() {
    const {
      classes,
      nlp: {
        amount,
        isConnected,
        items
      }
    } = this.props
    const {isOpen} = this.state

    return (
      <div className={classes.task}>
        <TaskButton
          onRefButton={this.onRefButton}
          onClick={this.onToggleDropdown}
          isConnected={isConnected}
          amount={amount}
        />
        {isOpen &&
          <Dropdown
            target={this.buttonNode}
            onOutsideClick={this.onHideDropdown}
            placement="top"
            container={this}
          >
            <TasksList
              onClose={this.onHideDropdown}
              onSelectTask={this.onSelectTask}
              onRemoveTask={this.onRemoveTask}
              tasks={items}
            />
          </Dropdown>
        }
      </div>
    )
  }
}
