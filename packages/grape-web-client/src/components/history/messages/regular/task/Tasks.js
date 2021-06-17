import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import injectSheet from 'grape-web/lib/jss'

import Dropdown from '../../../../dropdown/Dropdown'
import TaskButton from './TaskButton'
import TasksList from './TasksList'
import CreateTask from './CreateTask'

@injectSheet({
  tasks: {
    position: 'relative',
    display: 'inline-block',
  },
  content: {
    width: 260,
  },
})
export default class Tasks extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tasks: PropTypes.array,
    services: PropTypes.array,
    isConnected: PropTypes.bool,
  }

  static defaultProps = {
    tasks: [],
    services: null,
    isConnected: false,
  }

  state = { isOpen: false }

  onToggleDropdown = e => {
    e.stopPropagation()
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  onHideDropdown = () => {
    this.setState({ isOpen: false })
  }

  onRefButton = ref => {
    this.buttonNode = findDOMNode(ref)
  }

  onSelectTask = task => {
    this.setState({ task })
  }

  onRemoveTask = () => {
    // TODO implement it
  }

  onGoBack = () => {
    this.setState({ task: null })
  }

  onSelectService = () => {
    // TODO implement it
  }

  renderContent() {
    const { task } = this.state
    const { tasks, services } = this.props

    if (task) {
      return (
        <CreateTask
          onClose={this.onHideDropdown}
          onGoBack={this.onGoBack}
          onSelectService={this.onSelectService}
          task={task}
          services={services}
        />
      )
    }

    return (
      <TasksList
        onClose={this.onHideDropdown}
        onSelectTask={this.onSelectTask}
        onRemoveTask={this.onRemoveTask}
        tasks={tasks}
      />
    )
  }

  render() {
    const { classes, tasks, isConnected } = this.props
    const { isOpen } = this.state

    return (
      <div className={classes.tasks}>
        <TaskButton
          onRefButton={this.onRefButton}
          onClick={this.onToggleDropdown}
          isConnected={isConnected}
          amount={tasks.length}
        />
        {isOpen &&
          tasks.length && (
            <Dropdown
              target={this.buttonNode}
              onOutsideClick={this.onHideDropdown}
              placement="top"
              container={this}
              shouldUpdatePosition
            >
              <div className={classes.content}>{this.renderContent()}</div>
            </Dropdown>
          )}
      </div>
    )
  }
}
