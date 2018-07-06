import sinon from 'sinon' // eslint-disable-line import/no-extraneous-dependencies
import api from '..'
import * as app from '../../app'
import conf from '../../conf'
import * as backend from '../../utils/backend/api/xhr'
import getBoundActions from '../../app/boundActions'

const mockInit = () => {
  const appMock = sinon.mock(app)
  appMock.expects('init').once()
  appMock.expects('renderSheetsInsertionPoints').once()
  const confMock = sinon.mock(conf)
  confMock.expects('setup').once()

  const all = [appMock, confMock]

  return {
    verifyAndRestore: () => {
      all.forEach(mock => {
        mock.verify()
        mock.restore()
      })
    },

    restore: () => {
      all.forEach(mock => {
        mock.restore()
      })
    },
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
    it('should call app.suspend()', async () => {
      const initMock = mockInit()
      const suspend = sinon
        .mock(app)
        .expects('suspend')
        .once()
      api.init({})
      await api.suspend()
      suspend.verify()
      suspend.restore()
      initMock.restore()
    })
  })

  describe('resume()', () => {
    it('should call app.resume()', async () => {
      const resume = sinon
        .mock(app)
        .expects('resume')
        .once()
      await api.resume()
      resume.verify()
      resume.restore()
    })
  })

  describe('embed()', () => {
    it('should throw when serviceUrl is missing', () => {
      expect(() => {
        api.embed()
      }).toThrow()
    })

    it('should call expected functions', async () => {
      const stub = sinon.stub(backend, 'loadConfig').returns(Promise.resolve())
      const mock = mockInit()
      await api.embed({ serviceUrl: 'something' })
      stub.restore()
      mock.verifyAndRestore()
    })
  })

  describe('show()', () => {
    it('should throw if called with bad argument', () => {
      expect(() => api.show('something')).toThrow()
    })

    it('should invoke action', async () => {
      const spy = sinon.spy(actions, 'showSidebar')
      await api.show('search')
      expect(spy.called).toBe(true)
      expect(spy.args[0][0]).toBe('search')
      spy.restore()
    })
  })

  describe('hide()', () => {
    it('should throw if called with bad argument', () => {
      expect(() => api.hide('something')).toThrow()
    })

    it('should invoke action', async () => {
      const spy = sinon.spy(actions, 'hideSidebar')
      await api.hide('search')
      expect(spy.called).toBe(true)
      spy.restore()
    })
  })

  describe('searchMessages()', () => {
    it('should invoke showSidebar', async () => {
      const spy = sinon.spy(actions, 'showSidebar')
      await api.searchMessages()
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('should invoke updateMessageSearchQuery', async () => {
      const spy = sinon.spy(actions, 'updateMessageSearchQuery')
      await api.searchMessages('ab')
      expect(spy.called).toBe(true)
      expect(spy.args[0][0]).toBe('ab')
      spy.restore()
    })
  })

  describe('setOpenFileDialogHandler()', () => {
    it('should accept a function only', async () => {
      expect(() => api.setOpenFileDialogHandler()).toThrow()
    })

    it('should invoke showSidebar', async () => {
      const spy = sinon.spy(actions, 'setOpenFileDialogHandler')
      const fn = () => null
      await api.setOpenFileDialogHandler(fn)
      expect(spy.called).toBe(true)
      expect(spy.args[0][0]).toBe(fn)
      spy.restore()
    })
  })

  describe('setAuthStatus()', () => {
    it('should have correct initial authStatus', () => {
      expect(api.authStatus).toBe('unauthorized')
    })

    it('should not emit when not changed', () => {
      const spy = sinon.spy(() => null)
      api.on('authChange', spy)
      api.setAuthStatus('unauthorized')
      expect(spy.called).toBe(false)
      expect(api.authStatus).toBe('unauthorized')
    })

    it('should emit when changed', () => {
      const spy = sinon.spy(() => null)
      api.on('authChange', spy)
      api.setAuthStatus('authorized')
      expect(spy.called).toBe(true)
      expect(spy.args[0][0]).toBe('authorized')
      expect(api.authStatus).toBe('authorized')
    })
  })

  describe('onHideSidebar()', () => {
    it('should emit when called', () => {
      const spy = sinon.spy(() => null)
      api.on('hide', spy)
      api.onHideSidebar()
      expect(spy.called).toBe(true)
    })
  })
})
