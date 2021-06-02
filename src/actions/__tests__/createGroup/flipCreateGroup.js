import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { flipCreateGroup } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('flipCreateGroup', () => {
  it('flipCreateGroup should dispatch HANDLE_CREATE_GROUP action', done => {
    expect(flipCreateGroup()).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_CREATE_GROUP }],
      err => {
        onError(done, err)
      },
    )
  })
})
