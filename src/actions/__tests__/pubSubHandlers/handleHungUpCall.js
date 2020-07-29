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
        calls: [
          {
            id: '05990999027840459020f0a05ef5040b',
          },
        ],
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
        calls: [
          {
            id: 'a4693a20a2ce4f1fb60d26b0ad0306da',
          },
        ],
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

  it('handleHungUpCall should dispatch END_SOUND, CLOSE_INCOMING_CALL, CLEAR_INCOMING_CALL_DATA and CLOSE_CALL_STATUS actions for 1-1 call', done => {
    expect(handleHungUpCall(psb4)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [
          {
            id: '05990999027840459020f0a05ef5040a',
          },
        ],
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
        { type: types.REMOVE_CALL },
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
        calls: [
          {
            id: '05990999027840459020f0a05ef5040a',
          },
        ],
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
        { type: types.REMOVE_CALL },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
