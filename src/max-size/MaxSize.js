import React, {PropTypes, Component} from 'react'

export default class MaxSize extends Component {
  static propTypes = {
    maxHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    maxWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  static defaultProps = {
    maxHeight: 160,
    maxWidth: 'initial'
  }

  getStyle() {
    const {maxWidth, maxHeight} = this.props
    return {
      overflow: 'auto',
      maxWidth,
      maxHeight
    }
  }

  render() {
    return (
      <div style={this.getStyle()}>
        {this.props.children}
      </div>
    )
  }

}
