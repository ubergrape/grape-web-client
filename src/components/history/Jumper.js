import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import {gainsboroDark} from 'grape-theme/dist/base-colors'

import buttonIcon from '../button/icon'

const size = 40
// We need even size so arrow will be centered.
const dimension = size % 2 ? size : size + 1
const contrast = 'rgba(255,255,255,0.75)'

@injectSheet({
  jumperContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  jumperButton: {
    extend: buttonIcon('arrowDown', {color: gainsboroDark, iconOnly: true}),
    position: 'absolute',
    fontSize: size,
    bottom: 20,
    left: '50%',
    width: dimension,
    height: dimension,
    padding: 5,
    transform: 'translateX(-50%)',
    background: contrast,
    border: `2px solid ${gainsboroDark}`,
    borderRadius: '50%',
    boxShadow: `0 0 0 3px ${contrast}`,
    cursor: 'pointer',
    boxSizing: 'content-box'
  }
})
export default class Jumper extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired,
    pagesBeforeShow: PropTypes.number
  }

  static defaultProps = {
    children: noop,
    onJump: noop,
    pagesBeforeShow: 2
  }

  constructor(props) {
    super(props)
    this.state = {show: false}
  }

  onScroll = ({scrollHeight, scrollTop, clientHeight}) => {
    const show = scrollHeight - scrollTop > clientHeight * (this.props.pagesBeforeShow * 2)
    if (this.state.show !== show) this.setState({show})
  }

  onJump = () => {
    this.setState({show: false}, this.props.onJump)
  }

  render() {
    const {classes, children} = this.props

    return (
      <div className={classes.jumperContainer}>
        {children({onScroll: this.onScroll})}
        {this.state.show && (
          <button
            className={classes.jumperButton}
            onClick={this.onJump}
          />
        )}
      </div>
    )
  }
}
