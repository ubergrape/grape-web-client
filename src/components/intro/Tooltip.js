import React, {PureComponent} from 'react'
import Position from 'react-overlays/lib/Position'
import warning from 'warning'
import {spacer} from 'grape-theme/dist/sizes'

import useTheme from '../theme/useTheme'
import {Tooltip as BaseTooltip} from '../tooltip'
import {containerStyle} from './constants'
import beacons from './beacons'

const Tooltip = useTheme(BaseTooltip, {
  arrowSize: spacer.xxl / 2,
  borderSize: 0,
  styles: {
    pointer: {
      background: containerStyle.background
    },
    body: containerStyle
  }
})

export default class IntroTooltip extends PureComponent {
  static defaultProps = {
    placement: 'right',
    container: document.body
  }

  state = {
    beacon: null
  }

  componentDidMount() {
    const {beacon} = this.props
    if (beacons[beacon]) beacons[beacon].then(this.setBeacon)
    else warning(false, 'Beacon "%s" is not registered.', beacon)
  }

  setBeacon = (beacon) => {
    this.setState({beacon})
  }


  render() {
    const {
      container,
      children
    } = this.props
    const {beacon} = this.state

    if (!beacon) return null

    const {placement, target, ...beaconRest} = beacon


    return (
      <Position
        container={container}
        placement={placement}
        target={target}
        shouldUpdatePosition
      >
        <Tooltip placement={placement} {...beaconRest}>
          {children}
        </Tooltip>
      </Position>
    )
  }
}
