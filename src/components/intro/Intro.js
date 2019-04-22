import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import steps from './steps'
import { zIndex } from '../../utils/z-index'

@injectSheet({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: zIndex('dialog'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default class Intro extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    step: PropTypes.number,
    show: PropTypes.bool,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    step: 0,
    show: false,
    permissions: {},
  }

  render() {
    const { classes, step, show, permissions, ...rest } = this.props
    const filteredSteps = steps(permissions)
    const Step = filteredSteps[step]

    if (!show || !permissions.canSeeTutorial) return null

    return (
      <div className={classes.root}>
        <Step {...rest} isLast={!filteredSteps[step + 1]} container={this} />
      </div>
    )
  }
}
