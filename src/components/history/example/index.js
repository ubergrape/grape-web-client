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

const minSize = 100
const minRange = 0
const maxRange = messages.length

const range = [messages.length - minSize, maxRange]
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
      range[0] = Math.max(range[0] + startIndex, minRange)
      range[1] = Math.min(range[1], range[0] + minSize)
    // Scrolling down.
    } else {
      range[0] = range[1] - minSize
      range[1] = Math.min(range[1] + stopIndex, maxRange)
    }

    const nextFragment = messages.slice.apply(messages, range)
    // Don't update if the fragment hasn't changed.
    if (nextFragment[0] !== fragment[0] && nextFragment[1] !== fragment[1]) {
      fragment = nextFragment
      resolvePromise(fragment)
    }

    isLoading = false
  })

  return new Promise(resolve => resolvePromise = resolve)
}


const container = document.querySelectorAll('.history')[0]

function create(props) {
  render(
    createElement(History, props),
    container
  )
}

const element = create({
  messages: fragment,
  onLoadMore: loadMore
})

window.addMessage = () => {
  const message = createMessage(messages.length)
  messages.push(message)
  fragment.push(message)
  create({
    messages: fragment,
    onLoadMore: loadMore
  })
}

window.addManyMessages = () => {
  for (let i = 0; i < 5; i++) {
    const message = createMessage(messages.length)
    messages.push(message)
    fragment.push(message)
  }

  create({
    messages: fragment,
    onLoadMore: loadMore
  })
}

window.scrollToMessage = () => {
  create({
    messages: fragment,
    onLoadMore: loadMore,
    scrollTo: fragment[fragment.length - 20]
  })
}
