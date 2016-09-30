import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './jumperTheme'

@injectSheet(styles)
export default class Jumper extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: noop,
    onJump: noop
  }

  constructor(props) {
    super(props)
    this.state = {show: false}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onRowsRendered = ({startIndex, stopIndex, overscanStopIndex}) => {
    const rowsPerPage = stopIndex - startIndex
    if (rowsPerPage > 0 && overscanStopIndex - stopIndex >= rowsPerPage) {
      if (!this.state.show) this.setState({show: true})
      return
    }
    if (this.state.show) this.setState({show: false})
  }

  onJump = () => {
    this.setState({show: false}, this.props.onJump)
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.jumperContainer}>
        {this.props.children({onRowsRendered: this.onRowsRendered})}
        {this.state.show &&
          <button
            className={classes.jumperButton}
            onClick={this.onJump}></button>}
      </div>
    )
  }
}
