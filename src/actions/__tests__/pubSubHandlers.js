import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../app/history'

import * as types from '../../constants/actionTypes'

import {
  handleRejectedCall,
  handleMissedCall,
  handleHungUpCall,
  handleJoinedCall,
  handleIncomingCall,
  handleStartedCall,
  handleFinishedCall,
} from '..'
import {
  psb1,
  psb2,
  psb3,
  psb4,
  psb5,
  psb6,
  psb7,
  psb8,
  psb9,
  psb10,
  psb11,
  psb12,
  psb13,
  psb14,
  psb15,
  psb16,
  psb17,
} from './data/pubSubHandlers'
import { ic1, ic2, ic3, ic4, ic5 } from './data/incomingCall'
import { c1, c2, с3 } from './data/channels'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}

describe('pubSubHandlers actions', () => {
  it('handleRejectedCall should not disaptch any actions', done => {
    expect(handleRejectedCall(psb1)).toDispatchActionsWithState(
      {
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

  it('handleHungUpCall should not disaptch any actions', done => {
    expect(handleHungUpCall(psb3)).toDispatchActionsWithState(
      {
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

  it('handleJoinedCall should not disaptch any actions for 1-1 call with different call id', done => {
    expect(handleJoinedCall(psb5)).toDispatchActionsWithState(
      {
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

  it('handleJoinedCall should dispatch HANDLE_JOINED_CALL actions for user who is creating 1-1 call', done => {
    expect(handleJoinedCall(psb6)).toDispatchActionsWithState(
      {
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

  it('handleJoinedCall should dispatch END_SOUND, CLOSE_INCOMING_CALL and HANDLE_JOINED_CALL actions for user who accepting 1-1 call', done => {
    expect(handleJoinedCall(psb7)).toDispatchActionsWithState(
      {
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
        { type: types.HANDLE_JOINED_CALL },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should dispatch END_SOUND, CLOSE_INCOMING_CALL and HANDLE_JOINED_CALL actions for user who joining group call', done => {
    expect(handleJoinedCall(psb11)).toDispatchActionsWithState(
      {
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
        { type: types.HANDLE_JOINED_CALL },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleJoinedCall should not disaptch any actions for group call to user who started call', done => {
    expect(handleJoinedCall(psb12)).toDispatchActionsWithState(
      {
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

  it('handleMissedCall should not disaptch any actions', done => {
    expect(handleMissedCall(psb8)).toDispatchActionsWithState(
      {
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

  it('handleIncomingCall should disaptch CLOSE_INCOMING_CALL, CLOSE_CALL_STATUS and HANDLE_INCOMING_CALL actions', done => {
    expect(handleIncomingCall(ic5)).toDispatchActionsWithState(
      {
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

  it('handleIncomingCall should disaptch CLOSE_INCOMING_CALL, CLOSE_CALL_STATUS, HANDLE_INCOMING_CALL, SHOW_INCOMING_CALL and HANDLE_NOTIFICATION actions', done => {
    expect(handleIncomingCall(ic5)).toDispatchActionsWithState(
      {
        channels: [с3],
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

  it('handleStartedCall should disaptch ADD_CALL action', done => {
    expect(handleStartedCall(psb13)).toDispatchActionsWithState(
      {
        user: {
          id: 13762,
        },
      },
      [{ type: types.ADD_CALL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleStartedCall should disaptch HANDLE_JOINED_CALL and ADD_CALL actions', done => {
    expect(handleStartedCall(psb14)).toDispatchActionsWithState(
      {
        user: {
          id: 13761,
        },
      },
      [{ type: types.HANDLE_JOINED_CALL }, { type: types.ADD_CALL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleFinishedCall should disaptch REMOVE_CALL action', done => {
    expect(handleFinishedCall(psb15)).toDispatchActionsWithState(
      {
        channels: [
          {
            id: 1,
          },
          {
            id: 6009,
            current: true,
            calls: [
              {
                id: 'f4fcee65-b818-457e-857a-fc59d23362b5',
              },
            ],
          },
        ],
      },
      [{ type: types.REMOVE_CALL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleFinishedCall should disaptch REMOVE_CALL and CLOSE_CALL_STATUS actions', done => {
    expect(handleFinishedCall(psb16)).toDispatchActionsWithState(
      {
        channels: [
          {
            id: 1,
          },
          {
            id: 6009,
            current: true,
            calls: [
              {
                id: 'f4fcee65-b818-457e-857a-fc59d23362b5',
              },
            ],
          },
        ],
      },
      [{ type: types.CLOSE_CALL_STATUS }, { type: types.REMOVE_CALL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleFinishedCall should not dispatch any actions', done => {
    expect(handleFinishedCall(psb17)).toDispatchActionsWithState(
      {
        channels: [
          {
            id: 1,
          },
        ],
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })
})
