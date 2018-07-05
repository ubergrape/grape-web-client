export default (route, params) => {
  switch (route) {
    case 'pm':
      return {
        mateId: Number(params.mateId),
      }
    case 'channel':
      return {
        channelId: Number(params.channelId),
        messageId: params.messageId,
      }
    case 'root':
    default:
      return {}
  }
}
