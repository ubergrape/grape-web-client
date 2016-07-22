import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import {styles} from './jumperTheme'

@useSheet(styles)
export default class Jumper extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: '',
    children: noop,
    onJump: noop
  }

  constructor(props) {
    super(props)
    this.state = {show: false}
  }

  onRowsRendered = ({startIndex, stopIndex, overscanStopIndex}) => {
    const rowsPerPage = stopIndex - startIndex
    if (overscanStopIndex - stopIndex >= rowsPerPage) {
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
      <div className={this.props.className}>
        {this.props.children({onRowsRendered: this.onRowsRendered})}
        {this.state.show &&
          <button
            className={classes.jumper}
            onClick={this.onJump}></button>}
      </div>
    )
  }
}
