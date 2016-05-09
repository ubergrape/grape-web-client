import {render} from 'react-dom'
import {createElement} from 'react'
import History from '../History'
import random from 'lodash/number/random'

const now = Date.now()
const messages = []

for (let i = 0; i < 10; i++) {
  messages.push({
    id: random(100000000),
    author: 'Author A',
    authorId: 'authora',
    avatar: 'avatar.gif',
    content: 'within 5 min from the same user-' + i,
    time: new Date(now + i * 1000 * 60)
  })
}

const text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. '

const createMessage = (i) => {
  return {
    id: random(100000000),
    authorId: 'author' + i,
    author: 'Author-' + i,
    content: i + ' - ' + text.substr(0, text.length / random(5)),
    avatar: 'avatar.gif',
    time: new Date(now + i * 1000 * 60 * 60)
  }
}

for (let i = messages.length; i < 1000; i++) {
  messages.push(createMessage(i))
}

const container = document.querySelectorAll('.history')[0]

function create(props) {
  render(
    createElement(History, props),
    document.body.appendChild(container)
  )
}

// const maxStartIndex = messages.length - 1
// const minStartIndex = 0
const range = [messages.length - 31, messages.length]
let fragment = messages.slice.apply(messages, range)
let isLoading = false

function loadMore({startIndex, stopIndex}) {
  if (isLoading) return null

  let resolvePromise

  isLoading = true
  setTimeout(() => {
    console.log('loadMore', startIndex, stopIndex)
    // Scrolling up.
    if (startIndex < 0) {
      range[0] = range[0] + startIndex
    // Scrolling down.
    }

    fragment = messages.slice.apply(messages, range)
    resolvePromise(fragment)
    isLoading = false
  }, 100)

  return new Promise(resolve => resolvePromise = resolve)
}

create({
  messages: fragment,
  onLoadMore: loadMore
})
