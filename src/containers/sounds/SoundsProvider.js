import React from 'react'
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

const SoundsProvider = () => (
  <Provider store={getStore()}>
    <ConnectedSounds />
  </Provider>
)

export default SoundsProvider
