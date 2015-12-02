import expect from 'expect.js'
import mousetrap from 'mousetrap'

import store from '../../app/store'
import channelSearch from '../'
import setup from '../../test'

describe('ChannelSearch', () => {
  setup(store, channelSearch)

  it('should be shown', () => {
    mousetrap.trigger('mod+k')
    expect(store.getState().channelSearch.show).to.be(true)
  })
})
