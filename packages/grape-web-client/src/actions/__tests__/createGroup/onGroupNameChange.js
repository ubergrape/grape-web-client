import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { onGroupNameChange } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onGroupNameChange', () => {
  it('should dispatch HANDLE_GROUP_NAME_CHANGE action', done => {
    expect(onGroupNameChange()).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_GROUP_NAME_CHANGE }],
      err => {
        onError(done, err)
      },
    )
  })
})
