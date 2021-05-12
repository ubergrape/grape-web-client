// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect.js'
import goTo from '..'
import { callbacks } from './utils'

describe('goTo with url in electron mode', () => {
  it("shouldn't call any callbacks if URL has no messageId and channel is current", () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/chat/channel/6009', {
      currChannel: 6009,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
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

  it('should call onUpdateRouter callback if the path lead to chat', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/chat', {
      currChannel: 6009,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 1,
      },
      args: ['/chat', 'push'],
    })
  })

  it('should call onSilentChange callback if URL contains messageId and channel is current', () => {
    const { map, called, args } = callbacks()
    goTo(
      'https://grape.io/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003',
      {
        currChannel: 6009,
        serviceUrl: 'https://grape.io',
        mode: 'electron',
        ...map,
      },
    )
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 0,
        onSilentChange: 1,
        onUpdateRouter: 0,
      },
      args: [
        '/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003',
        {
          channelId: 6009,
          messageId: '3d062f7810d411e8aa120242ac1d0003',
          type: 'channel',
        },
      ],
    })
  })

  it('should call onUpdateRouter callback if URL has no messageId and channel is not current', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/chat/channel/6009', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 1,
      },
      args: ['/chat/channel/6009', 'push'],
    })
  })

  it('should call onUpdateRouter callback if URL contains messageId and channel is not current', () => {
    const { map, called, args } = callbacks()
    goTo(
      'https://grape.io/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003',
      {
        currChannel: 2000,
        serviceUrl: 'https://grape.io',
        mode: 'electron',
        ...map,
      },
    )
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 1,
      },
      args: ['/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', 'push'],
    })
  })

  it('should call onExternal callback if URL leads to external website', () => {
    const { map, called, args } = callbacks()
    goTo('https://github.com', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://github.com', '_blank'],
    })
  })

  it('should call onExternal callback if URL has a foreign domain but the path is /chat/channel/:channelId', () => {
    const { map, called, args } = callbacks()
    goTo('https://github.com/chat/channel/6009', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://github.com/chat/channel/6009', '_blank'],
    })
  })

  it('should call onExternal callback if URL has a foreign domain but the path is /chat/pm/:mateId', () => {
    const { map, called, args } = callbacks()
    goTo('https://github.com/chat/pm/200', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://github.com/chat/pm/200', '_blank'],
    })
  })

  it('should call onExternal callback if URL with query param leads to sso page', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/sso/sso?next=/chat', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io/sso/sso?next=/chat',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 1,
        onRedirect: 0,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/sso/sso?next=/chat', '_blank'],
    })
  })

  it('should call onRedirect callback if URL leads to login page', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/accounts/login', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
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

  it('should call onRedirect callback if URL leads to logout page', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/accounts/logout', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 1,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/accounts/logout'],
    })
  })

  it('should call onExternal callback if URL outside of the chat', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/accounts/xxx', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
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

  it('should call onExternal callback if the path have parameters', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/guests/invite/?group_id=5&next=/chat', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
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

  it('should call onExternal callback if URL leads to the root', () => {
    const { map, called, args } = callbacks()
    goTo('https://grape.io/', {
      currChannel: 2000,
      serviceUrl: 'https://grape.io',
      mode: 'electron',
      ...map,
    })
    expect({ called, args }).to.eql({
      called: {
        onExternal: 0,
        onRedirect: 1,
        onSilentChange: 0,
        onUpdateRouter: 0,
      },
      args: ['https://grape.io/'],
    })
  })
})
