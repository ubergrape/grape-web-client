// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect.js'
import goTo from '..'
import { callbacks } from './utils'

describe('goTo with path in embedded mode', () => {
  it("shouldn't call any callbacks if the path has no messageId and channel is current", () => {
    const { map, called, args } = callbacks()
    goTo('/chat/channel/6009', {
      currChannel: 6009,
      mode: 'embedded',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: [],
    })
  })

  it('should call onExternal callback if the path lead to chat', () => {
    const { map, called, args } = callbacks()
    goTo('/chat', {
      currChannel: 6009,
      serviceUrl: 'https://grape.io',
      mode: 'embedded',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/chat', 'grape'],
    })
  })

  it('should call onExternal callback if the path has no messageId and channel is not current', () => {
    const { map, called, args } = callbacks()
    goTo('/chat/channel/6009', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'embedded',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/chat/channel/6009', 'grape'],
    })
  })

  it('should call onExternal callback if the path contains messageId and channel is not current', () => {
    const { map, called, args } = callbacks()
    goTo('/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'embedded',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: [
        'https://grape.io/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003',
        'grape',
      ],
    })
  })

  it('should call onRedirect callback if the path leads to login', () => {
    const { map, called, args } = callbacks()
    goTo('/accounts/login', {
      mode: 'embedded',
      serviceUrl: 'https://grape.io',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 1,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/accounts/login'],
    })
  })

  it('should call onSilentChange callback if the path leads to logout', () => {
    const { map, called, args } = callbacks()
    goTo('/accounts/logout', {
      mode: 'embedded',
      serviceUrl: 'https://grape.io',
      ...map,
    })
    // This is currently unused.
    // We can implement logout without redirect.
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 0,
        onSilentChange: 1,
        onUpdateRouter: 0,
      },
      args: ['/accounts/logout', {}],
    })
  })

  it('should call onExternal callback if the path leads outside of the chat', () => {
    const { map, called, args } = callbacks()
    goTo('/accounts/xxx', {
      mode: 'embedded',
      serviceUrl: 'https://grape.io',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/accounts/xxx', 'grape'],
    })
  })

  it('should call onExternal callback if the path leads to the root', () => {
    const { map, called, args } = callbacks()
    goTo('/', {
      mode: 'embedded',
      serviceUrl: 'https://grape.io',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/', 'grape'],
    })
  })

  it('should call onExternal callback if the path have parameters', () => {
    const { map, called, args } = callbacks()
    goTo('/guests/invite/?group_id=5&next=/chat', {
      mode: 'embedded',
      serviceUrl: 'https://grape.io',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/guests/invite/?group_id=5&next=/chat', 'grape'],
    })
  })

  it('should call onExternal callback if the path leads to /chat/pm and replace is true', () => {
    const { map, called, args } = callbacks()
    // We need replace: true, to not store current path in browser's history
    goTo('/chat/pm/200', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      replace: true,
      mode: 'embedded',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/chat/pm/200', 'grape'],
    })
  })
})
