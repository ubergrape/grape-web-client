import expect from 'expect.js'
import goTo from '..'

const testPathes = (mode) => {
  it('shouldn\'t call any callbacks if path has no messageId when channel is current', () => {
    let called
    goTo('/chat/channel/6009', {
      currChannel: 6009,
      mode,
      onExternal: () => {
        called = 'external'
      },
      onInternal: () => {
        called = 'internal'
      }
    })
    expect(called).to.be(undefined)
  })

  it('should call onInternal callback if path contains messageId when channel is current', () => {
    let called
    goTo('/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003', {
      currChannel: 6009,
      mode,
      onExternal: () => {
        called = 'external'
      },
      onInternal: () => {
        called = 'internal'
      }
    })
    expect(called).to.be('internal')
  })

  it('should call onExternal callback if has no messageId when channel is not current', () => {
    let called
    goTo('/chat/channel/6009', {
      currChannel: 2000,
      mode,
      onExternal: () => {
        called = 'external'
      },
      onInternal: () => {
        called = 'internal'
      }
    })
    if (mode === 'embedded') expect(called).to.be('external')
    else expect(called).to.be('internal')
  })

  it('should call onExternal callback if path contains messageId when channel is not current', () => {
    let called
    goTo('/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003/', {
      currChannel: 2000,
      mode,
      onExternal: () => {
        called = 'external'
      },
      onInternal: () => {
        called = 'internal'
      }
    })
    if (mode === 'embedded') expect(called).to.be('external')
    else expect(called).to.be('internal')
  })

  it('should call onExternal when path is not in the chat', () => {
    let called
    goTo('/accounts/login', {
      mode,
      serviceUrl: 'https://xxx.com',
      onExternal: () => {
        called = 'external'
      },
      onInternal: () => {
        called = 'internal'
      }
    })
    if (mode === 'full') expect(called).to.be('internal')
    else expect(called).to.be('external')
  })
}

const testUrls = () => {

}

describe('goTo', () => {
  describe('handle path for full mode', () => {
    testPathes('full')
  })

  describe('handle path for embedded mode', () => {
    testPathes('embedded')
    it('should pass a valid url and target to onExternal, if path is without messageId and channel is not current', () => {
      let expected
      goTo('/chat/channel/6009', {
        currChannel: 2000,
        mode: 'embedded',
        serviceUrl: 'https://xxx.com',
        onExternal: (...args) => {
          expected = args
        }
      })
      expect(expected).to.eql(['https://xxx.com/chat/channel/6009', 'grape'])
    })

    it('should pass a valid url and target to onExternal, if path is with messageId, and channel is not current', () => {
      let expected
      goTo('/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003/', {
        currChannel: 2000,
        mode: 'embedded',
        serviceUrl: 'https://xxx.com',
        onExternal: (...args) => {
          expected = args
        }
      })
      expect(expected).to.eql(['https://xxx.com/chat/channel/6009:3d062f7810d411e8aa120242ac1d0003/', 'grape'])
    })

    it('should pass a valid url and target to onExternal, if path is not in the chat', () => {
      let expected
      goTo('/accounts/login', {
        mode: 'embedded',
        serviceUrl: 'https://xxx.com',
        onExternal: (...args) => {
          expected = args
        }
      })
      expect(expected).to.eql(['https://xxx.com/accounts/login', 'grape'])
    })
  })

  describe('handle path for electron mode', () => {
    testPathes('electron')

    it('should pass a valid url and target to onExternal, if path is not in the chat', () => {
      let expected
      goTo('/accounts/login', {
        mode: 'electron',
        serviceUrl: 'https://xxx.com',
        onExternal: (...args) => {
          expected = args
        }
      })
      expect(expected).to.eql(['https://xxx.com/accounts/login', 'grape'])
    })
  })

  describe('handle url for electron mode', () => {
    testUrls('full')
  })

  describe('handle url for electron mode', () => {
    testUrls('embedded')
  })

  describe('handle url for electron mode', () => {
    testUrls('electron')
  })
})
