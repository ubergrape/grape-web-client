import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { handleFinishedCall } from '../..'
import { psb15, psb16, psb17 } from '../data/pubSubHandlers'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('handleFinishedCall action', () => {
  it('handleFinishedCall should dispatch REMOVE_CALL and REMOVE_CALL_FROM_CHANNEL actions', done => {
    expect(handleFinishedCall(psb15)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [
          {
            channel: 6009,
            id: 'f4fcee65-b818-457e-857a-fc59d23362b5',
          },
        ],
        channels: [
          {
            id: 1,
          },
          {
            id: 6009,
            current: true,
          },
        ],
      },
      [{ type: types.REMOVE_CALL }, { type: types.REMOVE_CALL_FROM_CHANNEL }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleFinishedCall should dispatch CLOSE_CALL_STATUS, REMOVE_CALL and REMOVE_CALL actions', done => {
    expect(handleFinishedCall(psb16)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [
          {
            channel: 6009,
            id: 'f4fcee65-b818-457e-857a-fc59d23362b5',
          },
        ],
        channels: [
          {
            id: 1,
          },
          {
            id: 6009,
            current: true,
          },
        ],
      },
      [
        { type: types.CLOSE_CALL_STATUS },
        { type: types.REMOVE_CALL },
        { type: types.REMOVE_CALL_FROM_CHANNEL },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleFinishedCall should not dispatch any actions if channel related to event not in store', done => {
    expect(handleFinishedCall(psb17)).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        calls: [
          {
            id: 'f4fcee65-b818-457e-857a-fc59d23362b5',
          },
        ],
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
