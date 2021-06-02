import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { handleStartedCall } from '../..'
import { psb13, psb14 } from '../data/pubSubHandlers'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('handleStartedCall action', () => {
  it('handleStartedCall should dispatch ADD_CALL_TO_CHANNEL action', done => {
    expect(handleStartedCall(psb13)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        user: {
          id: 13762,
        },
      },
      [{ type: types.ADD_CALL_TO_CHANNEL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleStartedCall should dispatch HANDLE_JOINED_CALL, ADD_CALL and ADD_CALL_TO_CHANNEL actions', done => {
    expect(handleStartedCall(psb14)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        user: {
          id: 13761,
        },
      },
      [
        { type: types.HANDLE_STARTED_CALL },
        { type: types.ADD_CALL },
        { type: types.ADD_CALL_TO_CHANNEL },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
