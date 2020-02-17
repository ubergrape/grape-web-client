import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'

import { handleHungUpCall } from '../..'
import { psb19, psb3, psb4, psb10 } from '../data/pubSubHandlers'
import { ic2 } from '../data/incomingCall'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}

describe('handleHungUpCall action', () => {
  it('handleHungUpCall should not dispatch any actions if organization ids different', done => {
    expect(handleHungUpCall(psb19)).toDispatchActionsWithState(
      {
        org: {
          id: 2,
        },
        incomingCall: {
          show: false,
          data: ic2,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleHungUpCall should not dispatch any actions if call ids different', done => {
    expect(handleHungUpCall(psb3)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        user: {
          id: 13761,
        },
        incomingCall: {
          show: false,
          data: ic2,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleHungUpCall should dispatch END_SOUND, CLOSE_INCOMING_CALL, CLEAR_INCOMING_CALL_DATA and CLOSE_CALL_STATUS actions for PM calls', done => {
    expect(handleHungUpCall(psb4)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        user: {
          id: 13761,
        },
        incomingCall: {
          show: false,
          data: ic2,
        },
      },
      [
        { type: types.END_SOUND },
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLEAR_INCOMING_CALL_DATA },
        { type: types.CLOSE_CALL_STATUS },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleHungUpCall should dispatch END_SOUND, CLOSE_INCOMING_CALL, CLEAR_INCOMING_CALL_DATA and CLOSE_CALL_STATUS actions for group calls', done => {
    expect(handleHungUpCall(psb10)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        user: {
          id: 13761,
        },
        incomingCall: {
          show: false,
          data: {},
        },
      },
      [
        { type: types.END_SOUND },
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLEAR_INCOMING_CALL_DATA },
        { type: types.CLOSE_CALL_STATUS },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
