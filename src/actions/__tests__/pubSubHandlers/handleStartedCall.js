import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'

import { handleStartedCall } from '../..'
import { psb13, psb14 } from '../data/pubSubHandlers'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}

describe('handleStartedCall action', () => {
  it('handleStartedCall should dispatch ADD_CALL action', done => {
    expect(handleStartedCall(psb13)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
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

  it('handleStartedCall should dispatch HANDLE_JOINED_CALL and ADD_CALL actions', done => {
    expect(handleStartedCall(psb14)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
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
})
