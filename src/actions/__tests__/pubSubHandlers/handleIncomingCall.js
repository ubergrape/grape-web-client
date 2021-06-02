import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { handleIncomingCall } from '../..'
import { ic5 } from '../data/incomingCall'
import { с3 } from '../data/channels'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('handleIncomingCall action', () => {
  it('handleIncomingCall should not dispatch any actions if organization ids different', done => {
    expect(handleIncomingCall(ic5)).toDispatchActionsWithState(
      {
        org: {
          id: 2,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleIncomingCall should dispatch CLOSE_INCOMING_CALL, CLOSE_CALL_STATUS, HANDLE_INCOMING_CALL, SHOW_INCOMING_CALL and HANDLE_NOTIFICATION actions', done => {
    expect(handleIncomingCall(ic5)).toDispatchActionsWithState(
      {
        channels: [с3],
        org: {
          id: 1,
        },
        user: {
          id: 2919,
        },
      },
      [
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLOSE_CALL_STATUS },
        { type: types.HANDLE_INCOMING_CALL },
        { type: types.SHOW_INCOMING_CALL },
        { type: types.HANDLE_NOTIFICATION },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleIncomingCall should dispatch CLOSE_INCOMING_CALL, CLOSE_CALL_STATUS and HANDLE_INCOMING_CALL actions', done => {
    expect(handleIncomingCall(ic5)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        user: {
          id: 2918,
        },
      },
      [
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLOSE_CALL_STATUS },
        { type: types.HANDLE_INCOMING_CALL },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
