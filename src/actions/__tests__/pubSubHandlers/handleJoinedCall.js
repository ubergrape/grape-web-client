import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { handleJoinedCall } from '../..'
import { psb20, psb5, psb6, psb7, psb11, psb12 } from '../data/pubSubHandlers'
import { ic3 } from '../data/incomingCall'
import { c1 } from '../data/channels'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('handleJoinedCall action', () => {
  it('handleJoinedCall should not dispatch any actions if organization ids different', done => {
    expect(handleJoinedCall(psb20)).toDispatchActionsWithState(
      {
        org: {
          id: 2,
        },
        calls: [],
        incomingCall: {
          show: false,
          data: ic3,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should not dispatch any actions for 1-1 call with different call id', done => {
    expect(handleJoinedCall(psb5)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        incomingCall: {
          show: false,
          data: ic3,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should dispatch HANDLE_JOINED_CALL action for user who is creating 1-1 call', done => {
    expect(handleJoinedCall(psb6)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        user: {
          id: 13762,
        },
        incomingCall: {
          show: false,
          data: ic3,
        },
      },
      [{ type: types.HANDLE_JOINED_CALL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should dispatch END_SOUND, CLOSE_INCOMING_CALL, ADD_CALL and HANDLE_JOINED_CALL actions for user who accepting 1-1 call', done => {
    expect(handleJoinedCall(psb7)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        channels: [c1],
        user: {
          id: 13761,
        },
        incomingCall: {
          show: false,
          data: ic3,
        },
      },
      [
        { type: types.END_SOUND },
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLEAR_INCOMING_CALL_DATA },
        { type: types.ADD_CALL },
        { type: types.HANDLE_JOINED_CALL },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should dispatch END_SOUND, CLOSE_INCOMING_CALL, ADD_CALL and HANDLE_JOINED_CALL actions for user who joining group call', done => {
    expect(handleJoinedCall(psb11)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        user: {
          id: 13761,
        },
        incomingCall: {
          show: false,
          data: ic3,
        },
      },
      [
        { type: types.END_SOUND },
        { type: types.CLOSE_INCOMING_CALL },
        { type: types.CLEAR_INCOMING_CALL_DATA },
        { type: types.ADD_CALL },
        { type: types.HANDLE_JOINED_CALL },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should not dispatch any actions for group call to user who started call', done => {
    expect(handleJoinedCall(psb12)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [],
        user: {
          id: 13761,
        },
        incomingCall: {
          show: false,
          data: ic3,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })
})
