import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { hideCreateGroup } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('hideCreateGroup', () => {
  it('should dispatch HIDE_CREATE_GROUP action', done => {
    expect(hideCreateGroup()).toDispatchActionsWithState(
      {},
      [{ type: types.HIDE_CREATE_GROUP }],
      err => {
        onError(done, err)
      },
    )
  })
})
