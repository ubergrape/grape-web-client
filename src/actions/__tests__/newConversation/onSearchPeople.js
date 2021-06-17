import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { itemsToLoad } from '../../../constants/navigation'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'
import { getUser } from '../../../../jest/mocks/dataMocks'

import { onSearchPeople } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onSearchPeople', () => {
  it('should not dispatch any actions', done => {
    expect(onSearchPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: generateArrayOfObjects(getUser, itemsToLoad),
          isPeopleWithPmLoading: true,
          peoplePage: 1,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_PEOPLE_SEARCH action', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_RESULTS_LENGTH__ = itemsToLoad - 1
    expect(onSearchPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: [],
          isPeopleWithPmLoading: false,
          peoplePage: 1,
        },
      },
      [{ type: types.HANDLE_PEOPLE_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_PEOPLE_SEARCH and  actions', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_RESULTS_LENGTH__ = itemsToLoad - 1
    expect(onSearchPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: [],
          isPeopleWithPmLoading: false,
          peoplePage: 1,
        },
      },
      [
        { type: types.HANDLE_PEOPLE_SEARCH },
        { type: types.REQUEST_MEMBERSHIP_PEOPLE_LOADING },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  afterEach(() => {
    /* eslint-disable no-underscore-dangle */
    global.__TEST_RESULTS_LENGTH__ = null
    /* eslint-enable no-underscore-dangle */
  })
})
