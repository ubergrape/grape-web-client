import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'

import { handleMissedCall } from '../..'
import { psb8, psb9, psb18 } from '../data/pubSubHandlers'
import { ic4 } from '../data/incomingCall'
import { c2 } from '../data/channels'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}

describe('handleMissedCall action', () => {
  it('handleMissedCall should not dispatch any actions if organization ids different', done => {
    expect(handleMissedCall(psb18)).toDispatchActionsWithState(
      {
        org: {
          id: 2,
        },
        calls: [],
        incomingCall: {
          show: false,
          data: ic4,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleMissedCall should not dispatch any actions if call ids different', done => {
    expect(handleMissedCall(psb8)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        incomingCall: {
          show: false,
          data: ic4,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleMissedCall should dispatch END_SOUND, CLOSE_INCOMING_CALL, CLEAR_INCOMING_CALL_DATA and HANDLE_NOTIFICATION actions', done => {
    expect(handleMissedCall(psb9)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        channels: [c2],
        user: {
          id: 13788,
        },
        incomingCall: {
          show: false,
          data: ic4,
        },
      },
      [
        { type: types.END_SOUND },
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLEAR_INCOMING_CALL_DATA },
        { type: types.HANDLE_NOTIFICATION },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
