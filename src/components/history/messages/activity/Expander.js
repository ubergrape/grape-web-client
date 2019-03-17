import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import { ShowMore, ShowLess } from '../../../i18n/i18n'
import button from '../../../button/link'
import { bubbleBorderRadius as borderRadius } from '../../../message-parts'
import { expanderColor } from './constants'

const maxHeight = 350

class Expander extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    onToggle: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
  }

  state = { isEnabled: false }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate() {
    this.update()
  }

  onRef = node => {
    this.node = node
  }

  onToggle = () => {
    this.props.onToggle({ isExpanded: !this.props.isExpanded })
  }

  update() {
    const { clientHeight } = this.node.firstElementChild
    if (clientHeight > maxHeight) {
      this.setState({ isEnabled: true })
    }
  }

  render() {
    const { children, classes, isExpanded } = this.props
    const { isEnabled } = this.state

    return (
      <div
        ref={this.onRef}
        className={
          classes[isExpanded ? 'expandedExpander' : 'collapsedExpander']
        }
      >
        {children}
        {isEnabled && (
          <div
            className={cn(classes.panel, !isExpanded && classes.collapsedPanel)}
          >
            <button onClick={this.onToggle} className={classes.button}>
              {isExpanded ? <ShowLess /> : <ShowMore />}
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default injectSheet({
  expandedExpander: {
    display: 'block',
    paddingBottom: 15,
  },
  collapsedExpander: {
    display: 'block',
    overflow: 'hidden',
    maxHeight,
  },
  panel: {
    position: props => (props.isExpanded ? 'relative' : 'absolute'),
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    borderRadius,
  },
  collapsedPanel: {
    composes: '$panel',
    paddingTop: 50,
    background: `linear-gradient(to bottom, rgba(237, 240, 245, 0) 0%, ${expanderColor} 70%)`,
    fallbacks: {
      background: expanderColor,
    },
  },
  button,
})(Expander)
