export default (route, params) => {
  switch (route) {
    case 'pm': {
      return {
        name: 'pm',
        params: {mateId: Number(params.mateId)}
      }
    }
    case 'channel': {
      const channelSplit = params.channel.split(':')
      return {
        name: 'channel',
        params: {
          channelId: Number(channelSplit[0]),
          messageId: channelSplit[1]
        }
      }
    }
    case 'root':
    default: {
      return {name: 'root'}
    }
  }
}
