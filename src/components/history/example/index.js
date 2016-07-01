import 'es6-promise'
import {render} from 'react-dom'
import {createElement} from 'react'
import History from '../History'
import random from 'lodash/number/random'
import moment from 'moment-timezone'

import 'image-zoom/dist/imagezoom.css'

const log = console.log.bind(console) // eslint-disable-line no-console

const now = Date.now()
const messages = []
const userId = 123456

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
  '[link](http://markdownlink.com)',
  '> quote',
  '1. test',
  '![Build Status](https://travis-ci.org/jsstyles/jss.svg?branch=master)',
  '<button>Button</button>'
]
const createMessage = (i, options = {}) => {
  const time = options.time || new Date(now + i * 1000 * 60 * 60)
  return {
    type: 'regular',
    id: random(100000000),
    link: 'link-to-message',
    author: {
      id: random(2) === 1 ? userId : i,
      name: 'Author-' + i
    },
    text: i + ' - ' + textParts.slice(0, random(textParts.length)).join('\n'),
    avatar: 'avatar.gif',
    time,
    userTime: random(2) === 1 ? moment(time).format() : moment(time).tz('America/Los_Angeles').format(),
    ...options
  }
}

for (let i = 0; i < 5; i++) {
  messages.push(createMessage(i, {
    author: {
      id: 'authora',
      name: 'Author A'
    },
    text: 'within 5 min from the same user-' + i,
    time: new Date(now + i * 1000 * 60)
  }))
}

for (let i = messages.length; i < 1000; i++) {
  messages.push(createMessage(i))
}

const frameSize = 100
const minRange = 0
const maxRange = messages.length

const range = [messages.length - frameSize, maxRange]
// To start from beginning.
// const range = [0, frameSize]
let fragment = messages.slice.apply(messages, range)
let isLoading = false
let update

function onLoad({startIndex, stopIndex}) {
  if (isLoading) return null

  isLoading = true
  setTimeout(() => {
    log('loadMore', startIndex, stopIndex)

    // Scroll to older.
    if (startIndex < 0) {
      range[0] = Math.max(range[0] + startIndex, minRange)
      range[1] = Math.min(range[1], range[0] + frameSize)
    // Scroll to newer.
    } else {
      range[0] = range[1] - frameSize
      range[1] = Math.min(range[1] + stopIndex, maxRange)
    }

    fragment = messages.slice.apply(messages, range)
    update()
    isLoading = false
  })
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

function onRead(message) {
  log('read', message)
}

const container = document.querySelectorAll('.history')[0]

update = (props) => {
  render(
    createElement(History, {
      userId,
      messages: fragment,
      onLoad,
      onEdit,
      onRemove,
      onResend,
      onRead,
      ...props
    }),
    container
  )
}

update()

window.addMessage = (options = {}) => {
  const message = createMessage(
    messages.length,
    {
      time: new Date(),
      author: {id: userId, name: 'Author'},
      ...options
    }
  )
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
          id: random(1000),
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
          id: random(1000),
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
    author: {
      id: '123',
      name: 'Github'
    }
  })
}

window.addMessageWithUserLink = () => {
  window.addMessage({
    text: 'simplelink.com'
  })
}

window.addMessageWithGrapeObjects = () => {
  window.addMessage({
    text:
      '[#68 Apple Test Account](cg://github|issue|92f69b7c6d181a6318e2935a3b7730ae|https://github.com/ubergrape/chatgrape_ios/issues/68||)\n\n' +
      '[room](cg://chatgrape|room|2253|/chat/testroom)\n\n' +
      '[SomeUser](cg://chatgrape|user|60|/chat/@someuser)'
  })
}
