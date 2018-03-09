import createHistory from 'history/createBrowserHistory'
import getBoundActions from './boundActions'

const history = createHistory()

export const push = history.push
export const replace = history.replace

history.push = (url) => {
  getBoundActions().goTo(url)
}
history.replace = (url) => {
  getBoundActions().goTo(url, {replace: true})
}

export default history
