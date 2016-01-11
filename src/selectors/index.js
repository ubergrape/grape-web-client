import {createSelector} from 'reselect'

export const searchInputSelector = createSelector(
  state => state.searchInput, state => state
)
