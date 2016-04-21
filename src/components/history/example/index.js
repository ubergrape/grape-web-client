import {render} from 'react-dom'
import {createElement} from 'react'
import times from 'lodash/utility/times'
import History from '../History'

const now = Date.now()
let messages = times(5).map((i) => {
  return {
    author: 'Author A',
    authorId: 'authora',
    avatar: 'avatar.gif',
    content: 'within 5 min from the same user' + i,
    time: new Date(now + i * 1000 * 60)
  }
})

const text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. '

messages = messages.concat(times(1000).map((i) => {
  return {
    authorId: 'author' + i,
    author: 'Author' + i,
    content: i + '  ' + text,
    avatar: 'avatar.gif',
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
