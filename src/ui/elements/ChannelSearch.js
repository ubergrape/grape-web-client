import Emitter from 'emitter'

import channelSearch from '../../../react-components/channel-search'

export default class ChannelSearch extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-channel-search')
  }

  redraw() {
  }

  onOrgReady(org) {
    this.org = org
    this.redraw()
  }
}
