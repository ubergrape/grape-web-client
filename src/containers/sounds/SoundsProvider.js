import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import { soundsSelector } from '../../selectors'
import getStore from '../../app/store'
import { Sounds } from '../../components/sounds'

const actionNames = {
  endSound: 'onEnded',
}

const ConnectedSounds = connect(
  soundsSelector,
  mapActionsToProps(actionNames),
)(Sounds)

export default class SoundsProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedSounds />
      </Provider>
    )
  }
}
