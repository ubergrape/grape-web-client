import sinon from 'sinon'
import expect from 'expect.js'

import api from '..'
import * as app from '../../app'
import conf from '../../conf'
import * as backend from '../../utils/backend/api/xhr'
import getBoundActions from '../../app/boundActions'

const mockInit = () => {
  const appMock = sinon.mock(app)
  appMock.expects('init').once()
  appMock.expects('renderSheetsInsertionPoints').once()
  appMock.expects('render').once()
  const confMock = sinon.mock(conf)
  confMock.expects('setup').once()

  const all = [appMock, confMock]

  return {
    verifyAndRestore: () => {
      all.forEach((mock) => {
        mock.verify()
        mock.restore()
      })
    },

    restore: () => {
      all.forEach((mock) => {
        mock.restore()
      })
    }
  }
}

describe('API', () => {
  let actions

  beforeEach(() => {
    actions = getBoundActions()
  })

  describe('init()', () => {
    it('should call expected functions', () => {
      const mock = mockInit()
      api.init()
      mock.verifyAndRestore()
    })
  })

  describe('suspend()', () => {
    it('should call app.suspend()', () => {
      const initMock = mockInit()
      const suspend = sinon.mock(app).expects('suspend').once()
      api.init({})
      api.suspend()
      suspend.verify()
      suspend.restore()
      initMock.restore()
    })
  })

  describe('resume()', () => {
    it('should call app.resume()', () => {
      const resume = sinon.mock(app).expects('resume').once()
      api.resume()
      resume.verify()
      resume.restore()
    })
  })

  describe('embed()', () => {
    it('should throw when serviceUrl is missing', () => {
      expect(() => {
        api.embed()
      }).to.throwError()
    })

    it('should call expected functions', () => {
      const stub = sinon.stub(backend, 'loadConfig').returns(Promise.resolve())
      const mock = mockInit()

      api.embed({serviceUrl: 'something'})

      stub.restore()
      mock.verifyAndRestore()
    })
  })

  describe('show()', () => {
    it('should throw if called with bad argument', () => {
      expect(() => api.show('something')).to.throwError()
    })

    it('should invoke action', () => {
      const spy = sinon.spy(actions, 'showSidebar')
      api.show('search')
      expect(spy.called).to.be(true)
      expect(spy.args[0][0]).to.be('search')
      spy.restore()
    })
  })

  describe('hide()', () => {
    it('should throw if called with bad argument', () => {
      expect(() => api.hide('something')).to.throwError()
    })

    it('should invoke action', () => {
      const spy = sinon.spy(actions, 'hideSidebar')
      api.hide('search')
      expect(spy.called).to.be(true)
      spy.restore()
    })
  })

  describe('searchMessages()', () => {
    it('should invoke showSidebar', () => {
      const spy = sinon.spy(actions, 'showSidebar')
      api.searchMessages()
      expect(spy.called).to.be(true)
      spy.restore()
    })

    it('should invoke updateMessageSearchQuery', () => {
      const spy = sinon.spy(actions, 'updateMessageSearchQuery')
      api.searchMessages('ab')
      expect(spy.called).to.be(true)
      expect(spy.args[0][0]).to.be('ab')
      spy.restore()
    })
  })

  describe('setOpenFileDialogHandler()', () => {
    it('should accept a function only', () => {
      expect(() => api.setOpenFileDialogHandler()).to.throwError()
    })

    it('should invoke showSidebar', () => {
      const spy = sinon.spy(actions, 'setOpenFileDialogHandler')
      const fn = () => null
      api.setOpenFileDialogHandler(fn)
      expect(spy.called).to.be(true)
      expect(spy.args[0][0]).to.be(fn)
      spy.restore()
    })
  })

  describe('setAuthStatus()', () => {
    it('should have correct initial authStatus', () => {
      expect(api.authStatus).to.be('unauthorized')
    })

    it('should not emit when not changed', () => {
      const spy = sinon.spy(() => null)
      api.on('authChange', spy)
      api.setAuthStatus('unauthorized')
      expect(spy.called).to.be(false)
      expect(api.authStatus).to.be('unauthorized')
    })

    it('should emit when changed', () => {
      const spy = sinon.spy(() => null)
      api.on('authChange', spy)
      api.setAuthStatus('authorized')
      expect(spy.called).to.be(true)
      expect(spy.args[0][0]).to.be('authorized')
      expect(api.authStatus).to.be('authorized')
    })
  })

  describe('onHideSidebar()', () => {
    it('should emit when called', () => {
      const spy = sinon.spy(() => null)
      api.on('hide', spy)
      api.onHideSidebar()
      expect(spy.called).to.be(true)
    })
  })
})
