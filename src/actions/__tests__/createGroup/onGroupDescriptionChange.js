import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { onGroupDescriptionChange } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onSearchMembers', () => {
  it('onGroupDescriptionChange should dispatch HANDLE_GROUP_DESCRIPTION_CHANGE action', done => {
    expect(onGroupDescriptionChange()).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_GROUP_DESCRIPTION_CHANGE }],
      err => {
        onError(done, err)
      },
    )
  })
})
