import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { showCreateGroup } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('showCreateGroup', () => {
  it('should dispatch SHOW_CREATE_GROUP action', done => {
    expect(showCreateGroup()).toDispatchActionsWithState(
      {},
      [{ type: types.SHOW_CREATE_GROUP }],
      err => {
        onError(done, err)
      },
    )
  })
})
