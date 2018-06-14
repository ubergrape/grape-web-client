import { Component } from 'react'
import PropTypes from 'prop-types'

import mapParams from './mapParams'

export default class RouteChanger extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onChangeRoute: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    params: PropTypes.shape({
      mateId: PropTypes.string,
      channelId: PropTypes.string,
      messageId: PropTypes.string,
    }),
    name: PropTypes.oneOf(['root', 'pm', 'channel']),
  }

  static defaultProps = {
    params: {
      mateId: '',
      channel: '',
    },
    name: 'root',
  }

  componentDidMount() {
    this.onChangeRoute()
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onChangeRoute()
    }
  }

  onChangeRoute() {
    const { params, name, onChangeRoute } = this.props

    onChangeRoute({
      name,
      params: mapParams(name, params),
    })
  }

  render() {
    return this.props.children
  }
}
