import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { introSelectorComponent as selector } from '../../selectors'
import { Intro } from '../../components/old/intro'

const actionNames = {
  showNextIntro: 'onNext',
  skipIntro: 'onSkip',
  doneIntro: 'onDone',
}

const ConnectedIntro = connect(
  selector,
  mapActionsToProps(actionNames),
)(Intro)

export default () => (
  <Provider store={getStore()}>
    <ConnectedIntro />
  </Provider>
)
