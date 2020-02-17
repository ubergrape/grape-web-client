import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'

import { handleRejectedCall } from '../..'
import { psb1, psb2, psb21 } from '../data/pubSubHandlers'
import { ic1 } from '../data/incomingCall'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}

describe('handleRejectedCall action', () => {
  it('handleRejectedCall should not dispatch any actions if call ids different', done => {
    expect(handleRejectedCall(psb1)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        incomingCall: {
          show: false,
          data: ic1,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleRejectedCall should not dispatch any actions if organization ids different', done => {
    expect(handleRejectedCall(psb21)).toDispatchActionsWithState(
      {
        org: {
          id: 2,
        },
        incomingCall: {
          show: false,
          data: ic1,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleRejectedCall should dispatch END_SOUND, CLOSE_INCOMING_CALL and CLEAR_INCOMING_CALL_DATA actions', done => {
    expect(handleRejectedCall(psb2)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        incomingCall: {
          show: false,
          data: ic1,
        },
      },
      [
        { type: types.END_SOUND },
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLEAR_INCOMING_CALL_DATA },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
