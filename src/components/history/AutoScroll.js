import {Component, PropTypes} from 'react'

export default class AutoScroll extends Component {
  static propTypes = {
    scrollToIndex: PropTypes.Number,
    rows: PropTypes.array.isRequired,
    bottomThreshold: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    bottomThreshold: 20,
    rows: []
  }

  constructor(props) {
    super(props)
    this.onScroll = ::this.onScroll
    this.scrollToIndex = props.scrollToIndex || props.rows.length - 1
  }

  onScroll({scrollHeight, clientHeight, scrollTop}) {
    if (!clientHeight) return
    const bottomThreshold = scrollHeight - scrollTop - clientHeight
    if (bottomThreshold < this.props.bottomThreshold) {
      this.scrollToIndex = this.props.rows.length - 1
    } else {
      this.scrollToIndex = undefined
    }
  }

  render() {
    return this.props.children({
      onScroll: this.onScroll,
      scrollToIndex: this.scrollToIndex
    })
  }
}
