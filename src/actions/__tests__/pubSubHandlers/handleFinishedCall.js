import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'

import { handleFinishedCall } from '../..'
import { psb15, psb16, psb17 } from '../data/pubSubHandlers'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}

describe('handleFinishedCall action', () => {
  it('handleFinishedCall should disaptch REMOVE_CALL action', done => {
    expect(handleFinishedCall(psb15)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
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
        org: {
          id: 1,
        },
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

  it('handleFinishedCall should not dispatch any actions if channel for event not in store', done => {
    expect(handleFinishedCall(psb17)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
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
