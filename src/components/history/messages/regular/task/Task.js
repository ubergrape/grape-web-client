import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import injectSheet from 'grape-web/lib/jss'

import Dropdown from '../../../../dropdown/Dropdown'
import TaskButton from './TaskButton'
import TasksList from './TasksList'
import CreateTask from './CreateTask'

const toggleOpenState = state => ({isOpen: !state.isOpen})

@injectSheet({
  task: {
    position: 'relative',
    display: 'inline-block'
  },
  content: {
    width: 260
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

  onSelectTask = (task) => {
    this.setState({task})
  }

  onRemoveTask = () => {
    // TODO implement it
  }

  onGoBack = () => {
    this.setState({task: null})
  }

  renderContent() {
    const {task} = this.state
    const {nlp} = this.props

    if (task) {
      return (
        <CreateTask
          onClose={this.onHideDropdown}
          onGoBack={this.onGoBack}
          task={task}
        />
      )
    }

    return (
      <TasksList
        onClose={this.onHideDropdown}
        onSelectTask={this.onSelectTask}
        onRemoveTask={this.onRemoveTask}
        tasks={nlp.items}
      />
    )
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
            <div className={classes.content}>
              {this.renderContent()}
            </div>
          </Dropdown>
        }
      </div>
    )
  }
}
