import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'

import steps from './steps'
import {zIndex} from '../../utils/z-index'

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
    alignItems: 'center'
  }
})
export default class Intro extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    step: PropTypes.number,
    show: PropTypes.bool
  }

  static defaultProps = {
    step: 0,
    show: true
  }

  render() {
    const {classes, step, show, ...rest} = this.props
    const Step = steps[step]

    if (!show) return null

    return (
      <div className={classes.root}>
        <Step {...rest} isLast={!steps[step + 1]} container={this} />
      </div>
    )
  }
}
