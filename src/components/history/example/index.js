import {render} from 'react-dom'
import {createElement} from 'react'
import History from '../History'
import random from 'lodash/number/random'
import moment from 'moment-timezone'

import 'image-zoom/dist/imagezoom.css'

const log = console.log.bind(console) // eslint-disable-line no-console

const now = Date.now()
const messages = []
const userId = '123456'

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
  '![Build Status](https://travis-ci.org/jsstyles/jss.svg?branch=master)',
  '<button>Button</button>'
]
const createMessage = (i, options = {}) => {
  const time = options.time || new Date(now + i * 1000 * 60 * 60)
  return {
    id: random(100000000),
    link: 'link-to-message',
    authorId: random(2) === 1 ? userId : 'author' + i,
    author: 'Author-' + i,
    text: i + ' - ' + textParts.slice(0, random(textParts.length)).join('\n'),
    avatar: 'avatar.gif',
    time,
    userTime: random(2) === 1 ? moment(time).format() : moment(time).tz('America/Los_Angeles').format(),
    ...options
  }
}

for (let i = 0; i < 5; i++) {
  messages.push(createMessage(i, {
    author: 'Author A',
    authorId: 'authora',
    text: 'within 5 min from the same user-' + i,
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

function onResend(message) {
  log('resend', message)
}

const container = document.querySelectorAll('.history')[0]

function update(props) {
  render(
    createElement(History, {
      userId,
      messages: fragment,
      onLoadMore,
      onEdit,
      onRemove,
      onResend,
      ...props
    }),
    container
  )
}

update()

window.addMessage = (options = {}) => {
  const message = createMessage(messages.length, {authorId: userId, ...options})
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

window.addMessageWithAttachment = (type) => {
  switch (type) {
    case 'pdf':
      window.addMessage({
        text: undefined,
        attachments: [{
          type: 'uploadedFile',
          id: String(random(1000)),
          name: 'some-file.pdf',
          time: new Date(),
          url: 'http://google.com',
          mimeType: 'application/pdf',
          category: 'pdf'
        }]
      })
      break
    case 'uploadedImage':
      window.addMessage({
        text: undefined,
        attachments: [{
          type: 'uploadedFile',
          id: String(random(1000)),
          time: new Date(),
          name: 'breaking-bad-die-besten-72440_big.jpg',
          thumbnailUrl: 'https://ug-cdn.com/media/chatgrape-staging/media/cache/57/26/57260f1e17ea4931421e37bfbb856f8f.png',
          thumbnailHeight: 125,
          thumbnailWidth: 295,
          url: 'https://ug-cdn.com/media/chatgrape-staging/media/organizations/1/9e1562d21df511e6802b001e67a039c2/breaking-bad-die-besten-72440_big.jpg',
          mimeType: 'image/jpeg',
          category: 'image'
        }]
      })
      break
    default:
  }
}

window.addActivityMessage = () => {
  window.addMessage({
    type: 'activity',
    container: {
      url: 'https://github.com/ubergrape/chatgrape',
      name: 'ubergrape/chatgrape'
    },
    title: '[sk7](https://github.com/sk7) closed pull request [#240 Services](https://github.com/ubergrape/chatgrape/pull/240)',
    text: 'let\'s merge this into master on thursday, shall we?',
    author: 'Github'
  })
}
