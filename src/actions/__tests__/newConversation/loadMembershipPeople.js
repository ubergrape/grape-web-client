import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { itemsToLoad } from '../../../constants/navigation'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'

import { getUser } from '../../../../jest/mocks/dataMocks'
import { loadMembershipPeople } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('loadMembershipPeople', () => {
  it('loadMembershipPeople should dispatch HANDLE_NO_OTHER_PEOPLE_IN_ORG action', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_EMPTY_RESULTS__ = true
    expect(loadMembershipPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: [],
          peoplePage: 1,
        },
      },
      [{ type: types.HANDLE_NO_OTHER_PEOPLE_IN_ORG }],
      err => {
        onError(done, err)
      },
    )
  })

  it('loadMembershipPeople should dispatch HANDLE_NO_PEOPLE_LEFT_TO_JOIN action', done => {
    expect(loadMembershipPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: [],
          peoplePage: 1,
        },
      },
      [{ type: types.HANDLE_NO_PEOPLE_LEFT_TO_JOIN }],
      err => {
        onError(done, err)
      },
    )
  })

  it('loadMembershipPeople should dispatch HANDLE_PEOPLE_SEARCH action', done => {
    expect(loadMembershipPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: [],
          peoplePage: 1,
        },
      },
      [{ type: types.HANDLE_PEOPLE_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('loadMembershipPeople should dispatch HANDLE_PEOPLE_SEARCH action', done => {
    expect(loadMembershipPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: 'query',
          people: generateArrayOfObjects(getUser, itemsToLoad),
          peoplePage: 2,
        },
      },
      [{ type: types.HANDLE_PEOPLE_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('loadMembershipPeople should dispatch HANDLE_GROUPS_SEARCH action', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_ERROR__ = true
    expect(loadMembershipPeople()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          peopleQuery: '',
          people: [],
          peoplePage: 1,
        },
      },
      [{ type: types.HANDLE_ERROR }, { type: types.SHOW_TOAST_NOTIFICATION }],
      err => {
        onError(done, err)
      },
    )
  })

  afterEach(() => {
    /* eslint-disable no-underscore-dangle */
    global.__TEST_EMPTY_RESULTS__ = false
    global.__TEST_ERROR__ = false
    /* eslint-enable no-underscore-dangle */
  })
})
