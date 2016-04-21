import {render} from 'react-dom'
import {createElement} from 'react'
import times from 'lodash/utility/times'
import History from '../History'

const now = Date.now()
let messages = times(5).map((i) => {
  return {
    author: 'Author A',
    authorId: 'authora',
    content: 'within 5 min from the same user' + i,
    time: new Date(now + i * 1000 * 60)
  }
})

messages = messages.concat(times(1000).map((i) => {
  return {
    authorId: 'author' + i,
    author: 'Author' + i,
    content: 'test' + i,
    time: new Date(now + i * 1000 * 60 * 60)
  }
}))

const props = {
  messages,
  onLoadMore: () => {
    console.log('loadMore')
  }
}

const container = document.createElement('div')
container.className = 'container'

render(
  createElement(History, props),
  document.body.appendChild(container)
)
