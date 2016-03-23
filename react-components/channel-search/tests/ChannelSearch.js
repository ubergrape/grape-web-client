import expect from 'expect.js'
import mousetrap from 'mousetrap'

import store from '../../app/store'
import ChannelSearchProvider from '../ChannelSearchProvider'
import setup from '../../test'

describe('ChannelSearch', () => {
  setup(store, ChannelSearchProvider)

  it('should be shown', () => {
    mousetrap.trigger('mod+k')
    expect(store.getState().channelSearch.show).to.be(true)
  })
})
