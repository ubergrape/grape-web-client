import expect from 'expect.js'
import mousetrap from 'mousetrap'

import { bindActionCreators } from 'redux'

import store from '../../app/store'
import channelSearchInit from '../'
import * as actions from '../../actions'

// TODO: create fake mocked store
function setup() {
  const component = channelSearchInit(
    store,
    document.body.appendChild(document.createElement('div'))
  )

  return {
    component,
    bindedActions: bindActionCreators(actions, store.dispatch)
  }
}

describe('ChannelSearch', () => {
  let {bindedActions} = setup()

  it('should be shown', () => {
    mousetrap.trigger('mod+k')
    expect(store.getState().channelSearch.show).to.be(true)
  })

  it('should be hidden after hideChannelSearch()', () => {
    bindedActions.hideChannelSearch()
    expect(store.getState().channelSearch.show).to.be(false)
  })
})
