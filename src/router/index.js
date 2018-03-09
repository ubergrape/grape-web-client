export const routes = {
  channel: '/chat/channel/:channelId([0-9]+):separator(:)?:messageId?/:slug?',
  pm: '/chat/pm/:mateId'
}
export {Link, Route, withRouter} from 'react-router-dom'
export {ConnectedRouter, routerReducer, routerMiddleware} from 'react-router-redux'
