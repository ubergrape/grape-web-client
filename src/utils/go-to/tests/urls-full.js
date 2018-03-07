import expect from 'expect.js'
import goTo from '..'
import {callbacks} from './utils'

describe.only('goTo with url in full mode', () => {
  it('shouldn\'t call any callbacks if URL has no messageId and channel is current', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/chat/channel/6009', {
      currChannel: 6009,
      serviceUrl: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 0},
      args: []
    })
  })

  it('should call onUpdateRouter callback if URL contains messageId and channel is current', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', {
      currChannel: 6009,
      serviceUrl: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 1},
      args: ['/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', 'push']
    })
  })

  it('should call onUpdateRouter callback if URL has no messageId and channel is not current', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/chat/channel/6009', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 1},
      args: ['/chat/channel/6009', 'push']
    })
  })

  it('should call onUpdateRouter callback if URL contains messageId and channel is not current', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 1},
      args: ['/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', 'push']
    })
  })

  it('should call onExternal callback if URL leads to other website', () => {
    const {map, called, args} = callbacks()
    goTo('https://github.com', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      locationHostName: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 1, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://github.com']
    })
  })

  it('should call onExternal callback if URL has a foreign domain but the path is /chat/channel/:channelId', () => {
    const {map, called, args} = callbacks()
    goTo('https://github.com/chat/channel/6009', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      locationHostName: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 1, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://github.com/chat/channel/6009']
    })
  })

  it('should call onExternal callback if URL has a foreign domain but the path is /chat/pm/:mateId', () => {
    const {map, called, args} = callbacks()
    goTo('https://github.com/chat/pm/200', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      locationHostName: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 1, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://github.com/chat/pm/200']
    })
  })

  it('should call onExternal callback if URL leads to login page', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/accounts/login', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      locationHostName: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 1, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://grape.io/accounts/login']
    })
  })

  it('should call onExternal callback if URL leads to logout page', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/accounts/logout', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      locationHostName: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 1, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://grape.io/accounts/logout']
    })
  })

  it('should call onRedirect callback if URL outside of the chat', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/accounts/xxx', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      locationHostName: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 1, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://grape.io/accounts/xxx']
    })
  })

  it('should call onExternal callback if URL leads to the root', () => {
    const {map, called, args} = callbacks()
    goTo('https://grape.io/', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'full',
      ...map
    })
    expect({called, args}).to.eql({
      called: {onExternal: 0, onRedirect: 1, onSilentChange: 0, onUpdateRouter: 0},
      args: ['https://grape.io/']
    })
  })
})
