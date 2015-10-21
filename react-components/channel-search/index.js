import ChannelSearch from './ChannelSearch'
export {ChannelSearch as ChannelSearch}

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-channel-search', ChannelSearch)
}
