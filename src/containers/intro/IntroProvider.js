import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {introSelector as selector} from '../../selectors'
import {Intro} from '../../components/intro'

const actionNames = {
  showNextIntro: 'onNext',
  skipIntro: 'onSkip',
  doneIntro: 'onDone'
}

const ConnectedIntro = connect(
  selector,
  mapActionsToProps(actionNames)
)(Intro)

export default class IntroProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedIntro />
      </Provider>
    )
  }
}
