import { createBrowserHistory as createHistory } from 'history'
import getBoundActions from './boundActions'

const history = createHistory()

export const { push, replace } = history

history.push = url => {
  getBoundActions().goTo(url)
}
history.replace = url => {
  getBoundActions().goTo(url, { replace: true })
}

export default history
