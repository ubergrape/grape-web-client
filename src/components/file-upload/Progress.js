import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import LinearProgress from 'material-ui/progress/LinearProgress'

import {styles} from './progressTheme'

@injectSheet(styles)
export default class Progress extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    complete: PropTypes.bool.isRequired,
    onNotify: PropTypes.func.isRequired
  }

  static defaultProps = {
    complete: false
  }

  constructor(props) {
    super(props)
    this.notify(props)
  }

  componentWillReceiveProps(nextProps) {
    this.notify(nextProps)
  }

  notify(props) {
    props.onNotify({
      id: props.id,
      message: this.renderProgress(props)
    })
  }

  renderProgress(props) {
    return <LinearProgress mode="determinate" value={Math.round(props.progress)} />
  }

  render() {
    return null
  }
}
