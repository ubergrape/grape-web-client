import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { itemsToLoad } from '../../../constants/navigation'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'
import { getRoom } from '../../../../jest/mocks/dataMocks'

import { onChangePeopleQuery } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onChangePeopleQuery', () => {
  it('should dispatch CHANGE_PEOPLE_QUERY action', done => {
    expect(onChangePeopleQuery()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: generateArrayOfObjects(getRoom, itemsToLoad),
          peoplePage: 1,
        },
      },
      [{ type: types.CHANGE_PEOPLE_QUERY }],
      err => {
        onError(done, err)
      },
    )
  })
})
