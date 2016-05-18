import {render} from 'react-dom'
import {createElement} from 'react'
import History from '../History'
import random from 'lodash/number/random'
import moment from 'moment-timezone'

const log = console.log.bind(console) // eslint-disable-line no-console

const now = Date.now()
const messages = []

const textParts = [
  ':)',
  ':thumbsup:',
  '__bold__',
  '*italic*',
  '~~strikethrough~~',
  '`code`',
  '```',
  'multiline code',
  '```',
  '[link](http://google.com)',
  '> quote',
  '\ngoogle.com',
  '1. test',
  '![Build Status](https://travis-ci.org/jsstyles/jss.svg?branch=master)'
]
const createMessage = (i, options = {}) => {
  const time = options.time || new Date(now + i * 1000 * 60 * 60)
  return {
    id: random(100000000),
    link: 'link-to-message',
    authorId: random(2) === 1 ? '123456' : 'author' + i,
    author: 'Author-' + i,
    content: i + ' - ' + textParts.slice(0, random(textParts.length)).join('\n'),
    avatar: 'avatar.gif',
    time,
    userTime: random(2) === 1 ? moment(time).format() : moment(time).tz('America/Los_Angeles').format(),
    ...options
  }
}

for (let i = 0; i < 10; i++) {
  messages.push(createMessage({
    author: 'Author A',
    authorId: 'authora',
    content: 'within 5 min from the same user-' + i,
    time: new Date(now + i * 1000 * 60)
  }))
}

for (let i = messages.length; i < 100; i++) {
  messages.push(createMessage(i))
}

const minSize = 100
const minRange = 0
const maxRange = messages.length

const range = [messages.length - minSize, maxRange]
let fragment = messages.slice.apply(messages, range)
let isLoading = false

function onLoadMore({startIndex, stopIndex}) {
  if (isLoading) return null

  let resolvePromise

  isLoading = true
  setTimeout(() => {
    log('loadMore', startIndex, stopIndex)

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

function onEdit(message) {
  log('edit', message)
}

function onRemove(message) {
  log('remove', message)
}

const container = document.querySelectorAll('.history')[0]

function update(props) {
  render(
    createElement(History, {
      userId: '123456',
      messages: fragment,
      onLoadMore,
      onEdit,
      onRemove,
      ...props
    }),
    container
  )
}

update()

window.addMessage = (options = {}) => {
  const message = createMessage(messages.length, options)
  messages.push(message)
  fragment.push(message)
  update()
}

window.addManyMessages = () => {
  for (let i = 0; i < 5; i++) {
    const message = createMessage(messages.length)
    messages.push(message)
    fragment.push(message)
  }

  update()
}

window.scrollToMessage = () => {
  update({
    scrollTo: fragment[fragment.length - 20]
  })
}
