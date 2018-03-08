import createHistory from 'history/createBrowserHistory'
import getBoundActions from './boundActions'

const history = createHistory()
history.originalPush = history.push
history.originalReplace = history.replace
history.push = (url) => {
  getBoundActions().goTo(url)
}
history.replace = (url) => {
  getBoundActions().goTo(url, {replace: true})
}

export default history
