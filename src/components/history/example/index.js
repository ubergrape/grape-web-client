import {render} from 'react-dom'
import {createElement} from 'react'
import times from 'lodash/utility/times'
import History from '../History'
import random from 'lodash/number/random'

const now = Date.now()
let messages = times(10).map((i) => {
  return {
    author: 'Author A',
    authorId: 'authora',
    avatar: 'avatar.gif',
    content: 'within 5 min from the same user' + i,
    time: new Date(now + i * 1000 * 60)
  }
})

const text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. '

const createMessage = (i) => {
  const length = random(5)
  return {
    authorId: 'author' + i,
    author: 'Author' + i,
    content: i + '  ' + text.substr(0, text.length / length),
    avatar: 'avatar.gif',
    time: new Date(now + i * 1000 * 60 * 60)
  }
}

messages = [...messages, ...times(100).map(createMessage)]

const container = document.createElement('div')
container.className = 'container'

function update(props) {
  render(
    createElement(History, props),
    document.body.appendChild(container)
  )
}

update({
  messages: messages,
  onLoadMore: (startIndex, stopIndex) => {
    console.log('loadMore', startIndex, stopIndex)
    const newMessages = []
    for (let i = startIndex; i <= stopIndex; i++) {
      newMessages.push(createMessage(i))
    }
    messages = [...messages, ...newMessages]
    update({messages})
  }
})
