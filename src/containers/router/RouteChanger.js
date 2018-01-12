import {Component} from 'react'
import PropTypes from 'prop-types'

import mapParams from './mapParams'

export default class RouteChanger extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onChangeRoute: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    params: PropTypes.shape({
      mateId: PropTypes.string,
      channel: PropTypes.string
    }),
    route: PropTypes.oneOf(['root', 'pm', 'channel'])
  }

  static defaultProps = {
    params: {
      mateId: '',
      channel: ''
    },
    route: 'root'
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
    const {
      params,
      route,
      onChangeRoute
    } = this.props

    onChangeRoute(mapParams(route, params))
  }

  render() {
    return this.props.children
  }
}
