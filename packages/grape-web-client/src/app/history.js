import { createBrowserHistory } from 'history'
import getBoundActions from './boundActions'

const history = createBrowserHistory()

export const { push, replace } = history

history.push = url => {
  getBoundActions().goTo(url)
}
history.replace = url => {
  getBoundActions().goTo(url, { replace: true })
}

export default history
