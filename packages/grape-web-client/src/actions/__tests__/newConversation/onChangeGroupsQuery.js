import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { itemsToLoad } from '../../../constants/navigation'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'
import { getRoom } from '../../../../jest/mocks/dataMocks'

import { onChangeGroupsQuery } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onChangeGroupsQuery', () => {
  it('should dispatch CHANGE_GROUPS_QUERY action', done => {
    expect(onChangeGroupsQuery()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: generateArrayOfObjects(getRoom, itemsToLoad),
          groupsPage: 1,
        },
      },
      [{ type: types.CHANGE_GROUPS_QUERY }],
      err => {
        onError(done, err)
      },
    )
  })
})
